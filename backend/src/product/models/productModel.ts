// Import required modules
import mongoose, { Schema, Document } from 'mongoose';

// Interface for Product document structure
export interface Product extends Document {
  userId: string; // ✅ NEW: link product to authenticated user
  brand: string;
  variant?: string;
  category: string;
  varietal?: string;
  vintage?: number;
  size_ml: number;
  unit?: string;
  appellation?: string;
  country?: string;
  quantity_full: number;
  quantity_partial?: number;
  location: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define schema for Product
const ProductSchema: Schema<Product> = new Schema<Product>(
  {
    // ✅ NEW FIELD: Authenticated user who owns this product
    userId: {
      type: String,
      required: true,
      index: true, // optional: allows efficient querying by user
    },

    // Brand name (e.g., Absolut, Stoli)
    brand: {
      type: String,
      required: true,
      trim: true,
    },

    // Variant or line (e.g., Mandrin, Raspberry)
    variant: {
      type: String,
      trim: true,
    },

    // Product category (e.g., vodka, wine, beer)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Wine varietal (e.g., Cabernet Sauvignon)
    varietal: {
      type: String,
      trim: true,
    },

    // Wine vintage (e.g., 2018)
    vintage: {
      type: Number,
      min: 1900,
      max: 2100,
    },

    // Bottle size in milliliters; defaults to 750ml
    size_ml: {
      type: Number,
      default: 750,
    },

    // Unit of measure (e.g., bottle, case)
    unit: {
      type: String,
      trim: true,
    },
    appellation: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },

    // Number of full bottles
    quantity_full: {
      type: Number,
      required: false,
      min: 0,
    },

    // Partial bottle estimate (e.g., 0.7)
    quantity_partial: {
      type: Number,
      min: 0,
      max: 1,
    },

    // Physical location in the bar (e.g., "stock room", "well 1 left")
    location: {
      type: String,
      required: true,
      default: 'unspecified',
      trim: true,
    },

    // Optional freeform notes
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export Product model
export default mongoose.model<Product>('Product', ProductSchema);
