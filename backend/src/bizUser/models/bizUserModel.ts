import mongoose, { Schema, Document, Types } from 'mongoose';

export interface BizUser extends Document {
  companyName: string;
  ownerId: Types.ObjectId; // Refers to the company admin user
  employees: Types.ObjectId[]; // List of User IDs
  maxInvites: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const bizUserSchema: Schema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maxInvites: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

export const BizUserModel = mongoose.model<BizUser>('BizUser', bizUserSchema);
