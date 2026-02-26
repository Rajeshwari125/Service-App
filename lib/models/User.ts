import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  mobile: string;
  email?: string;
  password?: string;
  role: 'customer' | 'provider' | 'admin';
  profileImage?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    location?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  providerInfo?: {
    businessName?: string;
    isVerified?: boolean;
    experience?: number;
  };
  status: 'active' | 'suspended' | 'pending_verification';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String },
  role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
  profileImage: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' }
    }
  },
  providerInfo: {
    businessName: String,
    isVerified: { type: Boolean, default: false },
    experience: Number
  },
  status: { type: String, enum: ['active', 'suspended', 'pending_verification'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
