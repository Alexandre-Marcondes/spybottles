import mongoose, { Schema, Document, Types } from 'mongoose';

// ✅ Company Tier Enum
export enum CompanyTier {
  Standard = 'standard',
  Pro = 'pro',
  Enterprise = 'enterprise',
}

// ✅ Interface
export interface Company extends Document {
  companyName: string;
  createdBy: Types.ObjectId;
  users?: Types.ObjectId[];
  tier?: CompanyTier;
  logo?: string;
  locations?: string[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Schema
const companySchema: Schema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tier: {
      type: String,
      enum: Object.values(CompanyTier),
      default: CompanyTier.Pro,
    },
    logo: {
      type: String,
    },
    locations: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CompanyModel = mongoose.model<Company>('Company', companySchema);
