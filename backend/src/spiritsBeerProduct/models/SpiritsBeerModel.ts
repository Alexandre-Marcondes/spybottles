// src/globalSpiritsBeer/models/SpiritsBeerModel.ts

import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface for Spirits and Beer Products
export interface SpiritsBeerProduct extends Document {
  _id: Types.ObjectId;
  userId: string;
  type: 'spirits' | 'beer';
  brand: string;
  variant?: string;
  category: string;
  age?: number;
  cask?: string;
  abv?: number;
  size_ml?: number;
  unit?: string;
  quantity_full: number;
  quantity_partial?: number;
  location?: string;
  notes?: string;
  country?: string;
  region?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define schema
const SpiritsBeerProductSchema: Schema<SpiritsBeerProduct> = new Schema<SpiritsBeerProduct>(
  {
    // Link to the user who owns this product
    userId: {
      type: String,
      required: true,
      index: true,
    },

    // 'spirits' or 'beer'
    type: {
      type: String,
      enum: ['spirits', 'beer'],
      default: 'spirits',
    },

    // Brand name (e.g., "Patrón", "Heineken")
    brand: {
      type: String,
      required: true,
      trim: true,
    },

    // Variant or product line (e.g., "Reposado", "IPA")
    variant: {
      type: String,
      trim: true,
    },

    // Category (e.g., tequila, vodka, beer)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional age (e.g., 12 years for Scotch)
    age: {
      type: Number,
      min: 1,
      max: 100,
    },

    // Optional cask type (e.g., "Sherry Cask")
    cask: {
      type: String,
      trim: true,
    },

    // Alcohol by volume percentage
    abv: {
      type: Number,
      min: 0,
      max: 100,
    },

    // Bottle or can size in milliliters
    size_ml: {
      type: Number,
      default: 750,
    },

    // Unit of measure (e.g., "bottle", "can")
    unit: {
      type: String,
      trim: true,
    },

    // Quantity in full units (e.g., 1 bottle)
    quantity_full: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Quantity in partial (e.g., 0.7 bottle)
    quantity_partial: {
      type: Number,
      min: 0,
      max: 1,
    },

    // Optional location in the bar
    location: {
      type: String,
      trim: true,
    },

    // Optional user notes
    notes: {
      type: String,
      trim: true,
    },

    // Optional country of origin (e.g., "Mexico")
    country: {
      type: String,
      trim: true,
    },

    // Optional region (e.g., "Jalisco", "Highlands")
    region: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<SpiritsBeerProduct>('SpiritsBeerProduct', SpiritsBeerProductSchema);
