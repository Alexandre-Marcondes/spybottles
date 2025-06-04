// src/sessions/utils/voiceParserUtils.ts
import { wordsToNumbers } from 'words-to-numbers';
import { smartMatchGlobalProduct } from '../../globalProduct/services/globalProductService';
import ProductModel from '../../product/models/productModel';
import { ParseResult } from '../sessionConstants';

/**
 * Parses the transcript and returns quantities + matched product (or temp).
 */
export const parseVoiceTranscript = async (
  transcript: string,
  userId: string
): Promise<ParseResult> => {
  const cleaned = transcript.trim().toLowerCase().replace(/-/g, ' ');

  // Step 1: Extract quantities and product name
  const { productName, quantity_full, quantity_partial } =
    await extractNameAndQuantities(cleaned);

  // Step 2: Try to match against global products
  const globalMatches = await smartMatchGlobalProduct(productName);
  if (globalMatches.length > 0) {
    const match = globalMatches[0];

    // Check if user already has this product
    const existing = await ProductModel.findOne({
      userId,
      globalProductId: match._id,
    });

    const userProduct = existing || new ProductModel({
      userId,
      globalProductId: match._id,
      brand: match.brand,
      variant: match.variant,
      category: match.category,
      isTemp: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!existing) await userProduct.save();

    return {
      productId: userProduct._id.toString(),
      quantity_full,
      quantity_partial,
      message: generateMessage(quantity_full, quantity_partial),
      brand: userProduct.brand,
      variant: userProduct.variant,
      category: userProduct.category,
    };
  }

  // Step 3: Suggestions fallback
  const suggestions = await smartMatchGlobalProduct(productName);
  if (suggestions.length > 0) {
    return {
      productId: '',
      quantity_full,
      quantity_partial,
      isTemp: true,
      suggestions: suggestions.map(
        s => `${s.brand}${s.variant ? ' ' + s.variant : ''}`
      ),
      message: 'No exact match. Did you mean one of these?',
    };
  }

  // Step 4: No match — create temp product
  const tempProduct = new ProductModel({
    userId,
    brand: productName,
    isTemp: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await tempProduct.save();

  return {
    productId: tempProduct._id.toString(),
    quantity_full,
    quantity_partial,
    isTemp: true,
    message: 'No match found. Product saved as temp item.',
    brand: productName,
  };
};

/**
 * Extracts product name and quantities (full and partial) from transcript.
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
    const parsed = wordsToNumbers(fullMatch[1].trim(), { fuzzy: true });
    if (typeof parsed === 'number') quantity_full = parsed;
  }

  const partialMatch = transcript.match(/point\s?([a-z\d\s]+)/);
  if (partialMatch && partialMatch[1]) {
    const parsed = wordsToNumbers(partialMatch[1].trim(), { fuzzy: true });
    if (typeof parsed === 'number') {
      const divisor = parsed <= 9 ? 10 : 100;
      quantity_partial = parseFloat((parsed / divisor).toFixed(2));
    }
  }

  const productName = transcript
    .replace(/point\s?[a-z\d\s]+/, '')
    .replace(/\d+\s*(bottles?|full)/i, '')
    .trim();

  return { productName, quantity_full, quantity_partial };
};

/**
 * Builds a helpful UX message based on quantities.
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
