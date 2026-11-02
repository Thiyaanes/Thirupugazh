import json, sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/data/thirupugazh.json', encoding='utf-8') as f:
    data = json.load(f)
for song in data:
    if song['number'] in [109, 384, 639]:
        eng = song.get('lyricsEnglish', [])
        print(f"--- Song {song['number']} ({len(eng)} lines) ---")
        for i, l in enumerate(eng):
            print(f"  [{i}] {repr(l)}")
        print()
