// src/sessions/utils/voiceParserUtils.ts

import { wordsToNumbers } from 'words-to-numbers';
import GlobalProductModel from '../../globalProduct/models/globalProductModel';
import { GlobalProduct } from '../../globalProduct/models/globalProductModel';

/**
 * Extracts the product name and quantities (full and partial) from a transcript.
 */
export const extractNameAndQuantities = async (
  transcript: string
): Promise<{
  productName: string;
  quantity_full: number;
  quantity_partial: number;
}> => {
  let quantity_full = 0;
  let quantity_partial = 0;

  const fullMatch = transcript.match(/(?:^|\s)([a-z\s\d]+?)(?=\s+(bottles?|full))/i);
  if (fullMatch && fullMatch[1]) {
    const rawFull = fullMatch[1].trim();
    const parsed = wordsToNumbers(rawFull, { fuzzy: true });
    if (typeof parsed === 'number') {
      quantity_full = parsed;
    }
  }

  const partialMatch = transcript.match(/point\s?([a-z\d\s]+)/);
  if (partialMatch && partialMatch[1]) {
    const rawPartial = partialMatch[1].trim();
    const parsed = wordsToNumbers(rawPartial, { fuzzy: true });
    if (typeof parsed === 'number') {
      const divisor = parsed <= 9 ? 10 : 100;
      const forcedDecimal = parsed / divisor;
      quantity_partial = parseFloat(forcedDecimal.toFixed(2));
    }
  }

  const productName = transcript
    .replace(/point\s?[a-z\d\s]+/, '')
    .replace(/\d+\s*(bottles?|full)/i, '')
    .trim();

  return { productName, quantity_full, quantity_partial };
};

/**
 * Finds exact match in GlobalProduct collection.
 */
export const findGlobalProductMatch = async (
  productName: string
): Promise<GlobalProduct[]> => {
  const terms = productName.split(' ').filter(Boolean);

  const query = {
    $or: [
      { brand: { $in: terms } },
      { variant: { $in: terms } },
    ],
  };

  return await GlobalProductModel.find(query).limit(3);
};

/**
 * Returns a message based on parsed quantities.
 */
export const generateMessage = (
  full: number,
  partial: number
): string => {
  if (full === 0 && partial > 0) {
    return 'Partial quantity detected. If you also meant full bottles, please say that separately.';
  }
  if (full > 0 && partial === 0) {
    return "Full quantity detected. If there are partials, say 'point five' in a separate sentence.";
  }
  if (full === 0 && partial === 0) {
    return 'No quantity detected. Please try again.';
  }
  return 'Quantity parsed successfully.';
};

/**
 * Returns fuzzy suggestions based on partial product name match.
 */
export const getFuzzyGlobalSuggestions = async (
  productName: string
): Promise<string[]> => {
  const regex = new RegExp(productName.split(' ')[0], 'i');
  const matches = await GlobalProductModel.find({ brand: regex }).limit(5);
  return matches.map((p) => `${p.brand} ${p.variant || ''}`.trim());
};