import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

CONSONANTS = r'[கஙசஞடணதநபமயரலவளழறன]'
VOWELS = r'[ாிீுூெேைொோௌ]'

def fix_tamil_text(s):
    if not s:
        return s
        
    s = s.replace('ொ', 'ொ')
    s = s.replace('தெ்த', 'மத்த').replace('தெி', 'மதி').replace('தெய', 'மதய').replace('தெ்', 'மத்').replace('தொ', 'மா').replace('தெள', 'மள')
    s = re.sub(r'\bதெ(?=' + CONSONANTS + r')', 'ம', s)
    
    s = s.replace('டை்', 'மட்')
    s = s.replace('ை்', 'ற்')
    s = s.replace('வைி', 'வி')
    s = s.replace('சச', 'செ')
    s = s.replace('சசா', 'சொ')
    s = s.replace('சசோ', 'சோ')
    s = s.replace('சசே', 'சே')
    s = s.replace('பச', 'பெ')
    s = s.replace('ணெ', 'ண')
    s = s.replace('ணெர', 'மணர')
    s = s.replace('கச', 'க')
    s = s.replace('ரெு', 'ரமு')

    # Fix 'ம' + C + 'ா' -> C + 'ொ'
    s = re.sub(r'ம(' + CONSONANTS + r')(?![்' + VOWELS[1:-1] + r'])ா', r'\1ொ', s)
    
    # Fix 'ப' + C + 'ா' -> C + 'ோ'
    s = re.sub(r'ப(' + CONSONANTS + r')(?![்' + VOWELS[1:-1] + r'])ா', r'\1ோ', s)
    
    # Fix 'ம' + C -> C + 'ெ'
    s = re.sub(r'(?<![கஙசஞடணதநபமயரலவளழறன]்)ம([கஙசஞடணதநபமரளழறன])(?![்' + VOWELS[1:-1] + r'])', r'\1ெ', s)
    
    # Fix 'ப' + C -> C + 'ே'
    s = re.sub(r'(?<![கஙசஞடணதநபமயரலவளழறன]்)ப([கஙசஞடணதநபமரலளழறன])(?![்' + VOWELS[1:-1] + r'])', r'\1ே', s)
    
    # Fix 'ட' + C -> C + 'ை'
    s = re.sub(r'(?<![கஙசஞடணதநபமயரலவளழறன]்)ட(' + CONSONANTS + r')(?![்' + VOWELS[1:-1] + r'])', r'\1ை', s)
    
    s = s.replace('டை', 'றை')
    s = s.replace('ெ்', 'ச்')
    s = re.sub(r'ெ(?=[ாிீுூெேைொோௌ' + CONSONANTS[1:-1] + r'\s]|$)', 'ச', s)
    s = s.replace('ாி', 'ரி')
    s = s.replace('நை்', 'நற்')
    s = s.replace('வைல்', 'டவல்')
    s = s.replace('தசயானை', 'மதயானை')
    s = s.replace('வயிைனை', 'வயிறனை')
    s = s.replace('மட்விழ்', 'மட்டவிழ்')
    s = s.replace('லெர்கொடு', 'மலர்கொடு')
    s = s.replace('அவைைினை', 'அடைவினை')
    s = s.replace('முற்டே', 'முற்பட')
    s = s.replace('முதல்பவானே', 'முதல்வோனே')
    s = s.replace('மனிறை', 'மதனிடை')
    s = s.replace('கசளுனற்', 'மகளுடன்')
    s = s.replace('ணெரெுள்', 'மணமருள்')

    return s

def main():
    json_path = 'src/data/thirupugazh.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Standard clean Tamil lyrics for Song 1 (கைத்தல நிறைகனி)
    song1_clean_lyrics = [
        "தத்தன தனதன தத்தன தனதன",
        "தத்தன தனதன",
        "தனதான",
        "கைத்தல நிறைகனி அப்பமொ டவல்பொரி",
        "கப்பிய கரிமுக னடிபேணிக்",
        "கற்றிடு மடியவர் புத்தியி லுறைபவ",
        "கற்பக மெனவினை கடிதேகும்",
        "மத்தமு மதியமும் வைத்திடு அரன்மகன்",
        "மற்பொரு திரள்புய மதயானை",
        "மத்தள வயிறனை உத்தமி புதல்வனை",
        "மட்டவிழ் மலர்கொடு பணிவேனே",
        "முத்தமி ழடைவினை முற்படு கிரிதனில்",
        "முற்பட எழுதிய முதல்வோனே",
        "முப்புர மெரிசெய்த அச்சிவ னுறைரதம்",
        "அச்சது பொடிசெய்த அதிதீரா",
        "அத்துய ரதுகொடு சுப்பிர மணிபடும்",
        "அப்புன மதனிடை இபமாகி",
        "அக்குற மகளுட னச்சிறு முருகனை",
        "அக்கண மணமருள் பெருமாளே."
    ]

    data[0]['titleTamil'] = "கைத்தல நிறைகனி"
    data[0]['titleEnglish'] = "Kaiththala Niraikani"
    data[0]['lyricsTamil'] = song1_clean_lyrics

    # Sync song 1 syncedLyrics as well
    if 'syncedLyrics' in data[0] and data[0]['syncedLyrics']:
        for idx, item in enumerate(data[0]['syncedLyrics']):
            if idx < len(song1_clean_lyrics):
                item['tamilText'] = song1_clean_lyrics[idx]

    # Process songs 2 onwards
    for song in data[1:]:
        song['titleTamil'] = fix_tamil_text(song.get('titleTamil', ''))
        song['templeTamil'] = fix_tamil_text(song.get('templeTamil', ''))
        song['lyricsTamil'] = [fix_tamil_text(l) for l in song.get('lyricsTamil', [])]
        for item in song.get('syncedLyrics', []):
            item['tamilText'] = fix_tamil_text(item.get('tamilText', ''))

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Successfully cleaned and saved {len(data)} songs into '{json_path}'!")

if __name__ == '__main__':
    main()
