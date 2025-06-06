// src/globalProduct/services/globalProductService.ts
import fuzzysort from 'fuzzysort';
import GlobalProductModel, { GlobalProduct } from '../models/globalProductModel';

const normalizeStringForMatching = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

/**
 * Attempts brand/variant splits from the back (variant priority).
 */
const tryVariantBrandSplit = (
  input: string,
  knownVariants: string[]
): { brand: string; variant: string }[] => {
  const words = input.split(' ');
  const combos: { brand: string; variant: string }[] = [];

  for (let i = Math.min(4, words.length - 1); i >= 1; i--) {
    const variantCandidate = words.slice(-i).join(' ');
    if (knownVariants.includes(variantCandidate)) {
      const brand = words.slice(0, -i).join(' ');
      combos.push({ brand, variant: variantCandidate });
    }
  }

  return combos;
};

let cachedVariants: string[] | null = null;

/**
 * Fuzzy matches brand + variant combos against DB.
 */
export const smartMatchGlobalProduct = async (
  input: string
): Promise<GlobalProduct[]> => {
  const normalizedInput = normalizeStringForMatching(input);

  // 🧠 Dynamically load all variants from DB once per server boot
  if (!cachedVariants) {
    const allVariants = await GlobalProductModel.distinct('variant');
    cachedVariants = allVariants
      .filter(Boolean)
      .map(v => normalizeStringForMatching(v));
  }

  const normalizedVariants = cachedVariants;
  const splits = tryVariantBrandSplit(normalizedInput, normalizedVariants);
  const products = await GlobalProductModel.find();

  const scored: { product: GlobalProduct; score: number }[] = [];

  for (const { brand, variant } of splits) {
    for (const p of products) {
      const brandScore = fuzzysort.single(
        normalizeStringForMatching(brand),
        normalizeStringForMatching(p.brand)
      );
      const variantScore = fuzzysort.single(
        normalizeStringForMatching(variant),
        normalizeStringForMatching(p.variant || '')
      );

      if (brandScore && variantScore) {
        scored.push({
          product: p,
          score: brandScore.score + variantScore.score,
        });
      }
    }
  }

  // Fallback: match full string
  if (scored.length === 0) {
    for (const p of products) {
      const combined = `${p.brand} ${p.variant || ''}`;
      const score = fuzzysort.single(
        normalizedInput,
        normalizeStringForMatching(combined)
      );
      if (score) {
        scored.push({ product: p, score: score.score });
      }
    }
  }

  return scored
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(s => s.product);
};

/**
 * Get all global products (admin panel or dev tool).
 */
export const getAllGlobalProducts = async (): Promise<GlobalProduct[]> => {
  return GlobalProductModel.find({});
};

/**
 * Add new global product.
 */
export const addGlobalProduct = async (data: GlobalProduct) => {
  return new GlobalProductModel(data).save();
};

/**
 * Update existing global product.
 */
export const updateGlobalProduct = async (
  id: string,
  updates: Partial<GlobalProduct>
) => {
  return GlobalProductModel.findByIdAndUpdate(id, updates, { new: true });
};
