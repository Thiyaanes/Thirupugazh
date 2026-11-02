import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def main():
    json_path = 'src/data/thirupugazh.json'
    print(f"Loading {json_path} ...")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    fixed_count = 0
    tamil_pattern = re.compile(r'[\u0b80-\u0bff]')

    for song in data:
        # Check if transliteration array contains Tamil chars (which means it's corrupted/wrong)
        current_trans = song.get('transliteration', [])
        is_bad = any(tamil_pattern.search(line) for line in current_trans)

        if is_bad:
            # Get cleaned lyricsEnglish
            eng = [l for l in song.get('lyricsEnglish', []) if l.strip() and not re.match(r'^\d+$', l.strip())]
            
            # Use eng to replace transliteration array
            song['transliteration'] = eng

            # Also update syncedLyrics
            synced = song.get('syncedLyrics', [])
            for i, item in enumerate(synced):
                # Put the English line in transliteration, fallback to empty string if it runs out
                item['transliteration'] = eng[i] if i < len(eng) else ""
            
            fixed_count += 1

    print(f"\nFixed {fixed_count} songs where transliteration contained Tamil text.")

    print(f"\nSaving ...")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Done! Saved {len(data)} songs to '{json_path}'.")

if __name__ == '__main__':
    main()
