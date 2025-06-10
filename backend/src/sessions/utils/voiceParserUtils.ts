// ✅ voiceParserUtils.ts fully scoped to spirits/beer parsing

import { wordsToNumbers } from 'words-to-numbers';


/**
 * Normalize transcript string for consistent matching.
 */
export const normalizeTranscriptForParsing = (transcript: string): string => {
  return transcript
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/one bottle|a bottle/gi, '1 full')
    .replace(/point\s?one/gi, '0.1')
    .replace(/point\s?five/gi, '0.5')
    .replace(/half/gi, '0.5')
    .replace(/quarter/gi, '0.25')
    .replace(/full bottle/gi, '1 full')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

/**
 * Extracts product name + full/partial quantities from normalized transcript.
 */
export const extractNameAndQuantities = (
  normalized: string
): {
  productName: string;
  quantity_full: number;
  quantity_partial: number;
} => {
  let transcript = normalized;
  let quantity_full = 0;
  let quantity_partial = 0;

  // 🟡 Match partial quantity first
  const pointMatch = transcript.match(/point\s?(one|two|three|four|five|six|seven|eight|nine|\d)/i);
  if (pointMatch) {
    const partialStr = wordsToNumbers(pointMatch[0]) as string;
    const parsedPartial = parseFloat(partialStr);


    // Clean both matched phrase and trailing number fragments
    transcript = transcript.replace(pointMatch[0], '');
    transcript = transcript.replace(/\b0?\.?\d+\b/, ''); // 

    if (!isNaN(parsedPartial)) quantity_partial = parsedPartial;
    transcript = transcript.replace(pointMatch[0], '');
  }

  // 🔸 Handle special phrases
  if (/half/i.test(transcript)) {
    quantity_partial = 0.5;
    transcript = transcript.replace(/half/gi, '');
  }

  if (/quarter/i.test(transcript)) {
    quantity_partial = 0.25;
    transcript = transcript.replace(/quarter/gi, '');
  }

  if (/a bottle/i.test(transcript)) {
    quantity_full = 1;
    transcript = transcript.replace(/a bottle/gi, '');
  }

  // 🔢 Match full bottle counts
  const fullMatch = transcript.match(/\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|\d+)\s?(full|bottles?|)?/i);
  if (fullMatch) {
    const fullStr = wordsToNumbers(fullMatch[0]) as string;
    const parsedFull = parseInt(fullStr);
    if (!isNaN(parsedFull)) quantity_full = parsedFull;
    transcript = transcript.replace(fullMatch[0], '');
  }

  // 🧼 Clean residuals to isolate product name
  const productName = transcript
    .replace(/\b(full|bottle|bottles|and|of|a)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    productName,
    quantity_full,
    quantity_partial,
  };
};

/**
 * UX helper: contextual messages for parsed quantity
 */
export const generateMessage = (
  full: number,
  partial: number
): string => {
  if (full === 0 && partial > 0) {
    return 'Partial quantity detected. Say full bottles separately if needed.';
  }
  if (full > 0 && partial === 0) {
    return 'Full quantity detected. Mention partials if any.';
  }
  if (full === 0 && partial === 0) {
    return 'No quantity detected. Please try again.';
  }
  return 'Quantity parsed successfully.';
};
