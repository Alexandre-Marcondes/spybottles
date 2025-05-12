import mongoose, { Schema, Document } from 'mongoose';

// Allowed session status values
export enum SessionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  FINALIZED = 'finalized',
}

// Interface for a single product entry in the session
export interface SessionItem {
  productId: mongoose.Types.ObjectId | string;
  name?: string;
  quantity_full: number;
  quantity_partial?: number;
  isTemp?: boolean;
  category?: string;
}

// Interface for the inventory session document
export interface InventorySession extends Document {
  userId: string;
  startedAt: Date;
  finalizedAt?: Date;               // or finalizedAt
  status: SessionStatus;        // should support 'active', 'paused', 'finalized'
  periodTag: string;            // NEW
  sessionLabel?: string;        // NEW
  items: SessionItem[];         // Must maintain order
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for a session item (product + count)
const SessionItemSchema: Schema = new Schema(
  {
    productId: {
      type: Schema.Types.Mixed,
      required: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    quantity_full: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity_partial: {
      type: Number,
      min: 0,
      max: 1,
    },
    isTemp: {
      type: Boolean,
      default: false,
    }
  },
  { _id: false }
);

// Main inventory session schema
const InventorySessionSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    finalizedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.ACTIVE,
    },
    periodTag: {
      type: String,
      required: true,
    },
    sessionLabel: {
      type: String,
      trim: true,
    },
    items: [SessionItemSchema],
    location: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export the InventorySession model
export default mongoose.model<InventorySession>('InventorySession', InventorySessionSchema);
