import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService extends Document {
  providerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'service' | 'rental';
  category: string;
  pricing: {
    amount: number;
    unit: string; // "hour" | "day" | "visit"
  };
  media: string[];
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
}

const ServiceSchema: Schema = new Schema({
  providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['service', 'rental'], required: true },
  category: { type: String, required: true },
  pricing: {
    amount: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  media: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service;
