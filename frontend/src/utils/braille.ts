// English Braille Grade 1 mapping
export const BRAILLE_MAP: Record<string, number[]> = {
  'A': [1], 'B': [1,2], 'C': [1,4], 'D': [1,4,5], 'E': [1,5],
  'F': [1,2,4], 'G': [1,2,4,5], 'H': [1,2,5], 'I': [2,4], 'J': [2,4,5],
  'K': [1,3], 'L': [1,2,3], 'M': [1,3,4], 'N': [1,3,4,5], 'O': [1,3,5],
  'P': [1,2,3,4], 'Q': [1,2,3,4,5], 'R': [1,2,3,5], 'S': [2,3,4], 'T': [2,3,4,5],
  'U': [1,3,6], 'V': [1,2,3,6], 'W': [2,4,5,6], 'X': [1,3,4,6], 'Y': [1,3,4,5,6], 'Z': [1,3,5,6],
  '1': [1], '2': [1,2], '3': [1,4], '4': [1,4,5], '5': [1,5],
  '0': [2,4,5], ' ': [],
}

// Dot positions in 2x3 grid (col, row): 1=(0,0), 2=(0,1), 3=(0,2), 4=(1,0), 5=(1,1), 6=(1,2)
export const DOT_POSITIONS: Record<number, [number, number]> = {
  1: [0, 0], 2: [0, 1], 3: [0, 2],
  4: [1, 0], 5: [1, 1], 6: [1, 2],
}

export function textToBraille(text: string): number[][] {
  return text.toUpperCase().split('').map(c => BRAILLE_MAP[c] || [])
}

export function brailleToText(dots: number[]): string {
  for (const [char, d] of Object.entries(BRAILLE_MAP)) {
    if (JSON.stringify(d.sort()) === JSON.stringify([...dots].sort())) return char
  }
  return '?'
}

export function dotsToUnicode(dots: number[]): string {
  if (!dots.length) return '⠀'
  let code = 0x2800
  for (const d of dots) code += Math.pow(2, d - 1)
  return String.fromCodePoint(code)
}
