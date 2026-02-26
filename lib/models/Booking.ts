import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  bookingDate: Date;
  timeSlot?: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled' | 'rejected';
  totalAmount: number;
  payment: {
    status: 'unpaid' | 'paid';
    transactionId?: string;
    method?: string;
  };
  location?: string;
  type: 'service' | 'rental';
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  bookingDate: { type: Date, required: true },
  timeSlot: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled', 'rejected'], 
    default: 'pending' 
  },
  totalAmount: { type: Number, required: true },
  payment: {
    status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    transactionId: String,
    method: String
  },
  location: String,
  type: { type: String, enum: ['service', 'rental'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
