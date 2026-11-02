"""
fix_english_lyrics.py
=====================
Fixes lyricsEnglish arrays in thirupugazh.json by removing:
  1. Header/metadata lines that leaked in (e.g. "paatal la (iruccenthuur)",
     "raakam - ...", "(etuppu - ...)", "thaalam - ...", etc.)
  2. Lyrics from OTHER songs that were appended after the real song ends.

The rule for case 2 (merged songs): once a "new song header" pattern is found
INSIDE the lyricsEnglish array, everything from that index onwards is removed.

For case 1 (etuppu-only starts): the leading header lines are removed but the
rest of the lyrics are kept.

After trimming, any trailing empty strings are also stripped.
"""
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# ── Pattern sets ────────────────────────────────────────────────────────────

# Lines that clearly are a "new song header" inside a lyricsEnglish block.
# If these appear mid-array, truncate at that point.
MID_SONG_CUTOFF_PATTERNS = [
    re.compile(r'^paatal\s+', re.IGNORECASE),             # "paatal la (iruccenthuur)"
    re.compile(r'^raakam\s*[-–\.]+', re.IGNORECASE),       # "raakam - ..." / "raakam-.."
    re.compile(r'^thaalam\s*[-–]', re.IGNORECASE),         # "thaalam - ..."
]

# Lines that are metadata/performance-notes at the TOP of lyricsEnglish.
# These should be stripped wherever they appear at the start.
LEADING_METADATA_PATTERNS = [
    re.compile(r'^\(etuppu', re.IGNORECASE),               # "(etuppu - ...)"
    re.compile(r'^\(.*?\)', re.IGNORECASE),                # Any standalone bracketed note
    re.compile(r'^raakam\s*[-–\.]+', re.IGNORECASE),
    re.compile(r'^thaalam\s*[-–]', re.IGNORECASE),
    re.compile(r'^paatal\s+', re.IGNORECASE),
    re.compile(r'^thalakita', re.IGNORECASE),               # "thalakita-1 1/2, thakathimi-2..."
    re.compile(r'^thakathimi', re.IGNORECASE),              # "thakathimi-2..."
    re.compile(r'^thi\S*ranatai', re.IGNORECASE),           # "thiஸ்ranatai (7 1/2)"
    re.compile(r'^thi\S*ranat', re.IGNORECASE),             # broader catch
    re.compile(r'^\w+\s*-\s*[0-9]/[0-9]', re.IGNORECASE),  # any "X - N/N" tala marker line
]

def is_mid_song_header(line: str) -> bool:
    stripped = line.strip()
    for pat in MID_SONG_CUTOFF_PATTERNS:
        if pat.match(stripped):
            return True
    return False

def is_leading_metadata(line: str) -> bool:
    stripped = line.strip()
    for pat in LEADING_METADATA_PATTERNS:
        if pat.match(stripped):
            return True
    return False

def clean_english_lyrics(lines: list[str], song_number: int) -> list[str]:
    if not lines:
        return lines

    # Step 1 – Find and truncate at mid-song cutoff point (extra songs appended)
    # Only look for mid-song headers AFTER at least 1 real lyric line has been seen
    real_lines_seen = 0
    cut_at = len(lines)
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped == '':
            continue  # blank lines don't count
        if is_mid_song_header(stripped) and real_lines_seen >= 1:
            cut_at = i
            break
        real_lines_seen += 1

    lines = lines[:cut_at]

    # Step 2 – Strip leading metadata lines (etuppu, raakam, etc. at the very top)
    while lines and is_leading_metadata(lines[0].strip()):
        lines = lines[1:]

    # Step 3 – Remove trailing blank lines
    while lines and not lines[-1].strip():
        lines = lines[:-1]

    return lines

def main():
    json_path = 'src/data/thirupugazh.json'
    print(f"Loading {json_path} ...")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    fixed_count = 0
    report = []

    for song in data:
        original = song.get('lyricsEnglish', [])
        cleaned = clean_english_lyrics(list(original), song['number'])

        if cleaned != original:
            removed = len(original) - len(cleaned)
            report.append(
                f"  Song {song['number']} ({song['id']}): "
                f"{len(original)} -> {len(cleaned)} lines "
                f"(removed {removed})"
            )
            song['lyricsEnglish'] = cleaned
            fixed_count += 1

    print(f"\nFixed {fixed_count} songs:")
    for line in report:
        print(line)

    print(f"\nSaving ...")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Done! Saved {len(data)} songs to '{json_path}'.")

if __name__ == '__main__':
    main()
