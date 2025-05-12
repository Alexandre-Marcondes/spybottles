import mongoose, { Schema, Document } from 'mongoose';

export interface TempProduct extends Document {
  tempId: string;
  name: string;
  spokenBy: string; // userId
  sessionId: string;
  matchedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const tempProductSchema = new Schema<TempProduct>(
  {
    tempId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    spokenBy: { type: String, required: true },
    sessionId: { type: String, required: true },
    matchedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  },
  { timestamps: true }
);

export default mongoose.model<TempProduct>('TempProduct', tempProductSchema);
