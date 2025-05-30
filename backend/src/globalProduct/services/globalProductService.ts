import GlobalProductModel, { GlobalProduct } from "../models/globalProductModel";

// Find close matches for a product name
export const findGlobalProductMatch = async (query: string): Promise<GlobalProduct[]> => {
  return GlobalProductModel.find({
    brand: new RegExp(query, 'i'), // fuzzy brand match
  }).limit(5); // or smarter search w/ weights
};

// Get all global products (for superAdmin)
export const getAllGlobalProducts = async (): Promise<GlobalProduct[]> => {
  return GlobalProductModel.find({});
};

// Add new global product (from scraper or admin tool)
export const addGlobalProduct = async (data: GlobalProduct) => {
  return new GlobalProductModel(data).save();
};

// Update product metadata (like region correction)
export const updateGlobalProduct = async (
  id: string,
  updates: Partial<GlobalProduct>
) => {
  return GlobalProductModel.findByIdAndUpdate(id, updates, { new: true });
};
