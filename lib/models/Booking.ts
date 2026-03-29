import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  customerId: any;
  providerId: any;
  serviceId: any;
  customerName?: string;
  providerName?: string;
  serviceTitle?: string;
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
  address?: string;
  notes?: string;
  type: 'service' | 'rental';
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  customerId: { type: Schema.Types.Mixed },
  providerId: { type: Schema.Types.Mixed },
  serviceId: { type: Schema.Types.Mixed },
  customerName: { type: String },
  providerName: { type: String },
  serviceTitle: { type: String },
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
  address: String,
  notes: String,
  type: { type: String, enum: ['service', 'rental'], required: true },
  createdAt: { type: Date, default: Date.now }
});

if (mongoose.models.Booking) {
  delete mongoose.models.Booking;
}
const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
