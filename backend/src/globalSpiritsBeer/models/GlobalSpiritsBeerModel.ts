// src/globalSpiritsBeer/models/GlobalSpiritsBeerModel.ts

import mongoose, { Schema, Document } from 'mongoose';

// Interface for global spirits and beer products
export interface GlobalSpiritsBeerProduct extends Document {
  brand: string;               // e.g., "Patrón", "Heineken"
  category: string;            // e.g., "vodka", "beer", "gin"
  subcategory?: string;        // e.g., "IPA", "bourbon", "lager"
  variant?: string;            // e.g., "Reposado", "Dry", "Cask Strength"
  region?: string;             // e.g., "Jalisco", "Scotland"
  country?: string;            // e.g., "Mexico", "USA", "Ireland"
  size_ml?: number;            // default 750
  unit?: string;               // e.g., "bottle", "can"
  style?: string;              // e.g., "Double IPA", "Saison"
  abv?: number;                // Alcohol by volume, e.g., 40.0
  notes?: string;              // Optional metadata or tasting notes
  isDiscontinued?: boolean;    // Flag for deprecated items
  createdAt: Date;
  updatedAt: Date;
}

// Schema for global spirits and beer products used for matching
const GlobalSpiritsBeerSchema = new Schema<GlobalSpiritsBeerProduct>(
  {
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, trim: true },
    variant: { type: String, trim: true },
    region: { type: String, trim: true },
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

export default mongoose.model<GlobalSpiritsBeerProduct>(
  'GlobalSpiritsBeerProduct',
  GlobalSpiritsBeerSchema
);
