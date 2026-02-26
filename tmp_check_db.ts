
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
}

// Import models
// Note: We need to define schemas here or import them correctly
const UserSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    role: String,
    createdAt: Date
}, { strict: false });

const ServiceSchema = new mongoose.Schema({
    title: String,
    type: String,
    pricing: Object,
    createdAt: Date
}, { strict: false });

const BookingSchema = new mongoose.Schema({
    status: String,
    totalAmount: Number,
    createdAt: Date
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const userCount = await User.countDocuments();
        const serviceCount = await Service.countDocuments();
        const bookingCount = await Booking.countDocuments();

        console.log(`\n--- Database Summary ---`);
        console.log(`Users: ${userCount}`);
        console.log(`Services: ${serviceCount}`);
        console.log(`Bookings: ${bookingCount}`);

        console.log(`\n--- Recent Users ---`);
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3);
        recentUsers.forEach(u => console.log(`- ${u.name} (${u.role}) - ${u.mobile}`));

        console.log(`\n--- Recent Services ---`);
        const recentServices = await Service.find().sort({ createdAt: -1 }).limit(3);
        recentServices.forEach(s => console.log(`- ${s.title} (${s.type})`));

        console.log(`\n--- Recent Bookings ---`);
        const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(3);
        recentBookings.forEach(b => console.log(`- ID: ${b._id} | Status: ${b.status} | Amount: ${b.totalAmount}`));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

check();
