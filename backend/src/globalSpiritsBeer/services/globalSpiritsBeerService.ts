// src/globalSpiritsBeer/services/globalSpiritsBeerService.ts
import fuzzysort from 'fuzzysort';
import GlobalSpiritsBeerModel, {
  GlobalSpiritsBeerProduct,
} from '../models/globalSpiritsBeerModel';

/**
 * Normalize strings for accent-insensitive, case-insensitive matching.
 */
const normalizeStringForMatching = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .trim();
};

/**
 * Try to split a string like "Patron Reposado" into brand + variant.
 * Returns possible combinations if variant is known.
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

// Only load variants once per boot to save DB reads
let cachedVariants: string[] | null = null;

/**
 * Fuzzy matches the transcript input against global spirits/beer products.
 * Attempts brand/variant split first, then falls back to full string match.
 */
export const smartMatchGlobalProduct = async (
  input: string
): Promise<GlobalSpiritsBeerProduct[]> => {
  const normalizedInput = normalizeStringForMatching(input);

  // 🧠 Cache all global variants on first run
  if (!cachedVariants) {
    const allVariants = await GlobalSpiritsBeerModel.distinct('variant');
    cachedVariants = allVariants
      .filter(Boolean)
      .map(v => normalizeStringForMatching(v));
  }

  const normalizedVariants = cachedVariants;
  const splits = tryVariantBrandSplit(normalizedInput, normalizedVariants);
  const products = await GlobalSpiritsBeerModel.find();

  const scored: { product: GlobalSpiritsBeerProduct; score: number }[] = [];

  // Brand + Variant split match scoring
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

  // Fallback: match whole string to combined "brand variant"
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

  // Sort best scores first (lower is better), return top 3 matches
  return scored
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(s => s.product);
};

/**
 * Return all global spirits/beer products.
 */
export const getAllGlobalProducts = async (): Promise<GlobalSpiritsBeerProduct[]> => {
  return GlobalSpiritsBeerModel.find({});
};

/**
 * Add a new global spirits/beer product.
 */
export const addGlobalProduct = async (data: GlobalSpiritsBeerProduct) => {
  return new GlobalSpiritsBeerModel(data).save();
};

/**
 * Update an existing global product by ID.
 */
export const updateGlobalProduct = async (
  id: string,
  updates: Partial<GlobalSpiritsBeerProduct>
) => {
  return GlobalSpiritsBeerModel.findByIdAndUpdate(id, updates, { new: true });
};
