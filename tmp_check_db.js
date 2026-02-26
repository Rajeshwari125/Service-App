
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://localhost:27017/servicehub";

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

        const userCount = await User.countDocuments();
        const serviceCount = await Service.countDocuments();
        const bookingCount = await Booking.countDocuments();

        console.log(`\n--- Database Summary ---`);
        console.log(`Users: ${userCount}`);
        console.log(`Services: ${serviceCount}`);
        console.log(`Bookings: ${bookingCount}`);

        console.log(`\n--- Recent Users (Latest 5) ---`);
        const recentUsers = await User.find().sort({ _id: -1 }).limit(5);
        recentUsers.forEach(u => console.log(`- ${u.name} (${u.role}) - ${u.mobile}`));

        console.log(`\n--- Recent Services (Latest 5) ---`);
        const recentServices = await Service.find().sort({ _id: -1 }).limit(5);
        recentServices.forEach(s => console.log(`- ${s.title} (${s.type})`));

        console.log(`\n--- Recent Bookings (Latest 5) ---`);
        const recentBookings = await Booking.find().sort({ _id: -1 }).limit(5);
        recentBookings.forEach(b => console.log(`- ID: ${b._id} | Status: ${b.status} | Amount: ${b.totalAmount}`));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

check();
