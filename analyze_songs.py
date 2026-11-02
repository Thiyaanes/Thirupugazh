import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Patterns that signal a new song header has leaked into a lyricsEnglish array
EXTRA_SONG_PATTERNS = [
    re.compile(r'^paatal\s+\w+\s*\(', re.IGNORECASE),       # "paatal la (iruccenthuur)"
    re.compile(r'^raakam\s*[-–]', re.IGNORECASE),             # "raakam - ..."
    re.compile(r'^\(etuppu', re.IGNORECASE),                  # "(etuppu- ...)"
    re.compile(r'^thaalam\s*[-–]', re.IGNORECASE),            # "thaalam - ..."
    re.compile(r'^\s*\d+\s*\.\s*[a-zA-Z]'),                   # numbered song entries
]

def find_extra_content_index(lines):
    """Return index of first 'extra song header' line, or -1 if clean."""
    for i, line in enumerate(lines):
        stripped = line.strip()
        for pat in EXTRA_SONG_PATTERNS:
            if pat.match(stripped):
                return i
    return -1

def main():
    json_path = 'src/data/thirupugazh.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    issues = []
    for song in data:
        eng = song.get('lyricsEnglish', [])
        idx = find_extra_content_index(eng)
        if idx != -1:
            issues.append({
                'number': song['number'],
                'id': song['id'],
                'title': song.get('titleEnglish', ''),
                'total_lines': len(eng),
                'extra_starts_at': idx,
                'first_extra_line': eng[idx],
            })

    print(f"Total songs: {len(data)}")
    print(f"Songs with extra/merged lyricsEnglish content: {len(issues)}")
    print()
    for issue in issues:
        print(f"  Song {issue['number']} ({issue['id']}) - {issue['title']}")
        print(f"    Total lines: {issue['total_lines']}, extra content starts at line index {issue['extra_starts_at']}")
        print(f"    First extra line: \"{issue['first_extra_line']}\"")
        print()

if __name__ == '__main__':
    main()
