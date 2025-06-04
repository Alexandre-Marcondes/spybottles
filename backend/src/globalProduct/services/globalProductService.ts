// import GlobalProductModel, { GlobalProduct } from "../models/globalProductModel";

// // Find close matches for a product name
// export const findGlobalProductMatch = async (query: string): Promise<GlobalProduct[]> => {
//   return GlobalProductModel.find({
//     brand: new RegExp(query, 'i'), // fuzzy brand match
//   }).limit(5); // or smarter search w/ weights
// };

// // Get all global products (for superAdmin)
// export const getAllGlobalProducts = async (): Promise<GlobalProduct[]> => {
//   return GlobalProductModel.find({});
// };

// // Add new global product (from scraper or admin tool)
// export const addGlobalProduct = async (data: GlobalProduct) => {
//   return new GlobalProductModel(data).save();
// };

// // Update product metadata (like region correction)
// export const updateGlobalProduct = async (
//   id: string,
//   updates: Partial<GlobalProduct>
// ) => {
//   return GlobalProductModel.findByIdAndUpdate(id, updates, { new: true });
// };
// src/globalProduct/services/globalProductService.ts

import GlobalProductModel, { GlobalProduct } from '../models/globalProductModel';

/**
 * Smart fuzzy match for voice search and admin lookup
 * - Matches brand, variant, and combined brand + variant
 */
export const smartMatchGlobalProduct = async (
  productName: string
): Promise<GlobalProduct[]> => {
  const terms = productName.trim().split(/\s+/).filter(Boolean);
  const regex = new RegExp(terms.join('.*'), 'i'); // e.g., "Patron.*Silver"

  return GlobalProductModel.find({
    $or: [
      { brand: regex },
      { variant: regex },
      {
        $expr: {
          $regexMatch: {
            input: { $concat: ['$brand', ' ', '$variant'] },
            regex: regex.source,
            options: 'i',
          },
        },
      },
    ],
  }).limit(5);
};

/**
 * Get all global products (for superAdmin panel, etc.)
 */
export const getAllGlobalProducts = async (): Promise<GlobalProduct[]> => {
  return GlobalProductModel.find({});
};

/**
 * Add a new global product (from admin or scraper)
 */
export const addGlobalProduct = async (data: GlobalProduct) => {
  return new GlobalProductModel(data).save();
};

/**
 * Update metadata for a global product (e.g. fix region or varietal)
 */
export const updateGlobalProduct = async (
  id: string,
  updates: Partial<GlobalProduct>
) => {
  return GlobalProductModel.findByIdAndUpdate(id, updates, { new: true });
};
