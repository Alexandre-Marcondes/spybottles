import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  userId: string;
  email: string;
  password: string;
  birthday: string;
  role: 'bartender' | 'manager' | 'admin' | 'other';
  bizId?: string | null;
  location: {
    lat: number;
    long: number;
  };
  phoneNumber: string;
  stripeCustomerId?: string | null;
  isPaid: boolean;
  isActive: boolean;
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
    enum: ['bartender', 'manager', 'admin', 'other'],
    required: true,
  },
  bizId: {
    type: String,
    required: false,
  },
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
  isPaid: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const UserModel = mongoose.model<User>('User', userSchema);
