import mongoose, { Schema, Document, Types } from 'mongoose';

export enum UserRole {
  Bartender = 'bartender',
  Manager = 'manager',
  CompanyAdmin = 'companyAdmin',
  SuperAdmin = 'superAdmin',
  Other = 'other',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

export interface User extends Document {
  email: string;
  password: string;
  birthday: string;
  role: UserRole;
  companies: Types.ObjectId[];
  location: {
    lat: number;
    long: number;
  };
  phoneNumber: string;
  stripeCustomerId?: string | null;
  isSelfPaid: boolean; // ✅ NEW
  isPaid: boolean;     // ✅ Legacy, optional to keep
  isActive: boolean;
  resetToken?: string;
  resetTokenExpires?: Date;
  subscriptionStatus?: SubscriptionStatus;
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
  },
  companies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'BizUser',
    },
  ],
  location: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  stripeCustomerId: {
    type: String,
    default: null,
  },
  isSelfPaid: {
    type: Boolean,
    default: false,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  resetToken: {
    type: String,
    required: false,
  },
  resetTokenExpires: {
    type: Date,
    required: false,
  },
  subscriptionStatus: {
  type: String,
  enum: Object.values(SubscriptionStatus),
  default: SubscriptionStatus.ACTIVE,
},
});

export const UserModel = mongoose.model<User>('User', userSchema);
