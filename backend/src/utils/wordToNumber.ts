/**
 * Maps full and partial word-based numbers up to 100.
 * Supports decimals like "point two five" (0.25) and "point fifteen" (0.15)
 */

export const wordToDigit: Record<string, number> = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
    sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
    twentyone: 21, twentytwo: 22, twentythree: 23, twentyfour: 24, twentyfive: 25,
    twentysix: 26, twentyseven: 27, twentyeight: 28, twentynine: 29, thirty: 30,
    thirtyone: 31, thirtytwo: 32, thirtythree: 33, thirtyfour: 34, thirtyfive: 35,
    thirtysix: 36, thirtyseven: 37, thirtyeight: 38, thirtynine: 39, forty: 40,
    fortyone: 41, fortytwo: 42, fortythree: 43, fortyfour: 44, fortyfive: 45,
    fortysix: 46, fortyseven: 47, fortyeight: 48, fortynine: 49, fifty: 50,
    fiftyone: 51, fiftytwo: 52, fiftythree: 53, fiftyfour: 54, fiftyfive: 55,
    fiftysix: 56, fiftyseven: 57, fiftyeight: 58, fiftynine: 59, sixty: 60,
    sixtyone: 61, sixtytwo: 62, sixtythree: 63, sixtyfour: 64, sixtyfive: 65,
    sixtysix: 66, sixtyseven: 67, sixtyeight: 68, sixtynine: 69, seventy: 70,
    seventyone: 71, seventytwo: 72, seventythree: 73, seventyfour: 74, seventyfive: 75,
    seventysix: 76, seventyseven: 77, seventyeight: 78, seventynine: 79, eighty: 80,
    eightyone: 81, eightytwo: 82, eightythree: 83, eightyfour: 84, eightyfive: 85,
    eightysix: 86, eightyseven: 87, eightyeight: 88, eightynine: 89, ninety: 90,
    ninetyone: 91, ninetytwo: 92, ninetythree: 93, ninetyfour: 94, ninetyfive: 95,
    ninetysix: 96, ninetyseven: 97, ninetyeight: 98, ninetynine: 99, onehundred: 100
  };
  
  export const decimalWords: Record<string, number> = {
    one: 0.1, two: 0.2, three: 0.3, four: 0.4, five: 0.5,
    six: 0.6, seven: 0.7, eight: 0.8, nine: 0.9, zero: 0.0,
    fifteen: 0.15, twentyfive: 0.25, thirty: 0.30, fifty: 0.5, seventyfive: 0.75
  };
  
  /**
   * Parses a spoken number word like "twenty two" or "point five"
   */
  export function parseWordNumber(word: string): number | null {
    const normalized = word.trim().toLowerCase().replace(/[-_\s]/g, '');
    return wordToDigit[normalized] ?? null;
  }
  
  export function parseDecimalWord(word: string): number | null {
    const normalized = word.trim().toLowerCase().replace(/[-_\s]/g, '');
    return decimalWords[normalized] ?? null;
  }
  