// src/sessions/utils/voiceParserUtils.ts
import { wordsToNumbers } from 'words-to-numbers';
import { smartMatchGlobalProduct } from '../../globalProduct/services/globalProductService';
import ProductModel from '../../product/models/productModel';
import { ParseResult } from '../sessionConstants';

/**
 * Normalizes voice input for better parsing accuracy.
 */
export const normalizeTranscriptForParsing = (transcript: string): string => {
  return transcript
    .normalize('NFD')                      // decomposes accents (é → e + ́)
    .replace(/[\u0300-\u036f]/g, '')      // removes accent marks
    .replace(/one bottle|a bottle/gi, '1 full')
    .replace(/point\s?one/gi, '0.1')
    .replace(/point\s?five/gi, '0.5')
    .replace(/half/gi, '0.5')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

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

  // 1️⃣ Handle "point X" or "point five"
  const pointMatch = transcript.match(/point\s?(one|two|three|four|five|six|seven|eight|nine|\d)/i);
  if (pointMatch) {
    const partialStr = wordsToNumbers(pointMatch[0]) as string; // e.g., "0.5"
    const parsedPartial = parseFloat(partialStr);
    if (!isNaN(parsedPartial)) {
      quantity_partial = parsedPartial;
    }
    transcript = transcript.replace(pointMatch[0], '');
  }

  // 2️⃣ Handle "half" or "quarter"
  if (/half/i.test(transcript)) {
    quantity_partial = 0.5;
    transcript = transcript.replace(/half/gi, '');
  }
  if (/quarter/i.test(transcript)) {
    quantity_partial = 0.25;
    transcript = transcript.replace(/quarter/gi, '');
  }

  // 3️⃣ Handle "a bottle" or "one full"
  if (/a bottle/i.test(transcript)) {
    quantity_full = 1;
    transcript = transcript.replace(/a bottle/gi, '');
  }

  // 4️⃣ Handle full numbers like "twenty five bottles"
  const fullMatch = transcript.match(/\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|\d+)\s?(full|bottles?|)/i);
  if (fullMatch) {
    const fullStr = wordsToNumbers(fullMatch[0]) as string;
    const parsedFull = parseInt(fullStr);
    if (!isNaN(parsedFull)) {
      quantity_full = parsedFull;
    }
    transcript = transcript.replace(fullMatch[0], '');
  }

  // 5️⃣ Clean leftover product name
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
