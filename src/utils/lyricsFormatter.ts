/**
 * lyricsFormatter.ts
 * 
 * Utility to reflow English/transliteration lyric lines so that each displayed
 * line contains approximately `wordsPerLine` words (default: 4).
 * 
 * Why: The raw data sometimes stores only 1-2 words per line, making lyrics
 * appear in a narrow column. By collecting all words and re-chunking them we
 * get wider, more readable lines without inserting hard-coded <br> tags.
 * 
 * Empty / blank lines in the original array are treated as paragraph/stanza
 * separators and are preserved as empty strings in the output.
 */
export function reflowLyricLines(lines: string[], wordsPerLine = 4): string[] {
  if (!lines || lines.length === 0) return lines;

  const result: string[] = [];

  // Walk through input lines and collect stanza groups separated by blank lines
  let stanzaBuffer: string[] = [];

  const flushStanza = () => {
    if (stanzaBuffer.length === 0) return;

    // Join all words from the stanza, then re-chunk into wordsPerLine groups
    const allWords = stanzaBuffer.join(' ').split(/\s+/).filter(Boolean);
    for (let i = 0; i < allWords.length; i += wordsPerLine) {
      result.push(allWords.slice(i, i + wordsPerLine).join(' '));
    }
    stanzaBuffer = [];
  };

  for (const line of lines) {
    if (!line.trim()) {
      // Blank line → stanza break
      flushStanza();
      result.push(''); // preserve the blank separator
    } else {
      stanzaBuffer.push(line.trim());
    }
  }

  // Flush any remaining stanza
  flushStanza();

  return result;
}
