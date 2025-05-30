import mongoose, { Schema, Document } from 'mongoose';

// Interface for global products used for matching
export interface GlobalProduct extends Document {
  brand: string;               // e.g., "Absolut", "Château Margaux"
  category: string;            // e.g., "vodka", "wine", "beer", "gin"
  subcategory?: string;        // e.g., "red", "white", "sparkling", "bourbon"
  variant?: string;            // e.g., "Mango", "Reserve", "Cask Strength"
  varietal?: string;           // e.g., "Cabernet Sauvignon", "Pinot Noir"
  region?: string;             // e.g., "Napa Valley", "Scotland"
  appellation?: string;        // e.g., "AOC Pauillac", "DOC Rioja"
  country?: string;            // e.g., "USA", "France", "Sweden"
  size_ml?: number;            // default 750
  unit?: string;               // "bottle", "can", "case"
  style?: string;              // e.g., "Double IPA", "Cask Strength", "Saison"
  abv?: number;                // alcohol by volume (e.g., 40.0)
  notes?: string;              // optional extra metadata
  isDiscontinued?: boolean;    // future-proofing
  createdAt: Date;
  updatedAt: Date;
}

// Global schema for alcohol products
const GlobalProductSchema = new Schema<GlobalProduct>(
  {
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, trim: true },
    variant: { type: String, trim: true },
    varietal: { type: String, trim: true },
    region: { type: String, trim: true },
    appellation: { type: String, trim: true },
    country: { type: String, trim: true },
    size_ml: { type: Number, default: 750 },
    unit: { type: String, trim: true },
    style: { type: String, trim: true },
    abv: { type: Number, min: 0, max: 100 },
    notes: { type: String, trim: true },
    isDiscontinued: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<GlobalProduct>('GlobalProduct', GlobalProductSchema);
