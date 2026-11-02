import fitz
import tamil
import re
import json
import os

print("Starting extraction of 330 Thirupugazh songs...")

# 1. Parse English Transliterations from thirupugal_full_text.txt
txt_path = '../thirupugal_full_text.txt'
if not os.path.exists(txt_path):
    txt_path = 'thirupugal_full_text.txt'

trans_dict = {}
if os.path.exists(txt_path):
    with open(txt_path, 'r', encoding='utf-8') as f:
        full_txt = f.read()

    matches = list(re.finditer(r'^(\d+)\s+([^(]+)\s*\(([^)]+)\)', full_txt, re.MULTILINE))
    for idx, m in enumerate(matches):
        num = int(m.group(1))
        title_eng = m.group(2).strip()
        temple_eng = m.group(3).strip()
        start = m.end()
        end = matches[idx+1].start() if idx+1 < len(matches) else len(full_txt)
        
        chunk = full_txt[start:end]
        lines = [
            l.strip() for l in chunk.split('\n') 
            if l.strip() and not l.startswith('Page #') and not l.startswith('Arunagiriyar') and not l.startswith('Contents')
        ]
        
        trans_dict[num] = {
            'titleEnglish': title_eng,
            'templeEnglish': temple_eng,
            'lines': lines
        }
    print(f"Loaded transliterations for {len(trans_dict)} songs from txt file.")

# 2. Parse Tamil PDF
pdf_path = '../Thiruppugazh - Pt. 1 (Poems 1 - 330) - Arunagirinaathar.pdf'
if not os.path.exists(pdf_path):
    pdf_path = 'Thiruppugazh - Pt. 1 (Poems 1 - 330) - Arunagirinaathar.pdf'

doc = fitz.open(pdf_path)
all_pages = []
for page in doc:
    raw_text = page.get_text('text')
    try:
        b = raw_text.encode('latin1', errors='ignore')
        u = tamil.tscii.convert_to_unicode(b.decode('latin1'))
        all_pages.append(u)
    except Exception as e:
        all_pages.append(raw_text)

tamil_full = '\n'.join(all_pages)

# Extract song blocks from PDF
header_matches = list(re.finditer(r'பாடல்\s*\d+[^\n]*', tamil_full))
song_headers = [m for m in header_matches if 'பாடல்கள் (' not in m.group(0)]

print(f"Found {len(song_headers)} song headers in Tamil PDF.")

# Standard Temple mappings Tamil <-> English
temple_map = {
    'விநாயகர் துதி': 'Vinayagar',
    'விநாயகர்': 'Vinayagar',
    'நுால்': 'Invocation',
    'திருப்பரங்குன்றம்': 'Thirupparankundram',
    'திருச்செந்துார்': 'Tiruchendur',
    'திருச்செந்தூர்': 'Tiruchendur',
    'பழநி': 'Palani',
    'சுவாமிமலை': 'Swamimalai',
    'திருத்தணி': 'Thiruthani',
    'திருத்தணிகை': 'Thiruthani',
    'பழமுதிர்ச்சோலை': 'Pazhamudircholai',
    'வயலூர்': 'Vayaloor',
    'காஞ்சீபுரம்': 'Kanchipuram',
    'திருவண்ணாமலை': 'Thiruvannamalai',
    'பொது': 'General'
}

songs = []
for i, m in enumerate(song_headers):
    song_num = i + 1
    start = m.end()
    end = song_headers[i+1].start() if i+1 < len(song_headers) else len(tamil_full)
    
    header_str = m.group(0).strip()
    chunk = tamil_full[start:end]
    
    # Extract temple / category in Tamil
    temple_ta = 'பொது'
    if '(' in header_str and ')' in header_str:
        temple_ta = header_str.split('(')[1].split(')')[0].strip()
    elif '--' in header_str:
        temple_ta = header_str.split('--')[1].strip()
        
    temple_eng = temple_map.get(temple_ta, temple_ta.title())
    
    raagam = 'N/A'
    talam = 'N/A'
    lyrics_ta = []
    
    for l in chunk.split('\n'):
        l = l.strip()
        if not l:
            continue
        if any(w in l for w in ['Project Madurai', 'aruNakirinAtar', 'tiruppukaz', 'part 1', 'Etext', 'kaumaram.com', 'Switzerland']):
            continue
        if l.startswith('ராகம்') or l.startswith('தாளம்'):
            if 'ராகம்' in l:
                raagam = l.split('ராகம்')[1].split(';')[0].replace('-', '').strip()
            if 'தாளம்' in l:
                talam = l.split('தாளம்')[1].replace('-', '').strip()
            continue
            
        cleaned = re.sub(r'\s*\.\.\.\.\.\.\s*', ' ', l).strip()
        cleaned = re.sub(r'\s*\.\s*\.\s*\.\s*\.\s*\.\s*', ' ', cleaned).strip()
        cleaned = re.sub(r'^-+$', '', cleaned).strip()
        
        if cleaned and not cleaned.startswith('பாடல்') and not cleaned.startswith('பக்கம்'):
            lyrics_ta.append(cleaned)
            
    # Tamil Title: first non-rhythm lyric line or header
    title_ta = ""
    for l in lyrics_ta:
        if not l.startswith('தத்தன') and not l.startswith('தனதன') and not l.startswith('தனத்த') and not l.startswith('தகதிமி') and not l.startswith('தத்தத்'):
            title_ta = l
            break
    if not title_ta and lyrics_ta:
        title_ta = lyrics_ta[0]
    if not title_ta:
        title_ta = f"பாடல் {song_num}"
    if len(title_ta) > 40:
        title_ta = title_ta[:40] + "..."

    # English Title & Transliteration matching
    trans_entry = trans_dict.get(song_num, {})
    title_en = trans_entry.get('titleEnglish', f"Thirupugazh {song_num}")
    if trans_entry.get('templeEnglish'):
        temple_eng = trans_entry['templeEnglish'].title()
        
    lyrics_trans = trans_entry.get('lines', [])
    if not lyrics_trans:
        # Fallback transliteration to Tamil lines if missing
        lyrics_trans = lyrics_ta

    # Synced lyrics line generation
    synced = []
    max_len = max(len(lyrics_ta), len(lyrics_trans))
    for s_idx in range(max_len):
        t_line = lyrics_ta[s_idx] if s_idx < len(lyrics_ta) else ""
        tr_line = lyrics_trans[s_idx] if s_idx < len(lyrics_trans) else t_line
        synced.append({
            'timestamp': s_idx * 4,
            'tamilText': t_line,
            'transliteration': tr_line
        })
        
    song_obj = {
        'id': f'tp{song_num:03d}',
        'number': song_num,
        'titleTamil': title_ta,
        'titleEnglish': title_en.title(),
        'temple': temple_eng,
        'templeTamil': temple_ta,
        'singer': 'அருணகிரிநாதர்',
        'raagam': raagam if raagam not in ['.....', ''] else 'N/A',
        'talam': talam if talam not in ['.........', ''] else 'N/A',
        'lyricsTamil': lyrics_ta,
        'transliteration': lyrics_trans,
        'meaning': 'இப்பாடலின் பொருள் விரைவில் சேர்க்கப்படும்.',
        'syncedLyrics': synced,
        'category': [temple_ta, 'திருப்புகழ்'],
        'isFeatured': (song_num in [1, 6, 7, 10, 36, 131, 231, 330])
    }
    songs.append(song_obj)

output_path = 'src/data/thirupugazh.json'
os.makedirs('src/data', exist_ok=True)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(songs, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(songs)} Thirupugazh songs in '{output_path}'!")
