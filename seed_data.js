
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://localhost:27017/servicehub";

const UserSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    password: { type: String, default: 'password123' },
    role: String,
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const ServiceSchema = new mongoose.Schema({
    providerId: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    type: String,
    category: String,
    pricing: Object,
    media: [String],
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
}, { strict: false });

const BookingSchema = new mongoose.Schema({
    customerId: mongoose.Schema.Types.ObjectId,
    providerId: mongoose.Schema.Types.ObjectId,
    serviceId: mongoose.Schema.Types.ObjectId,
    bookingDate: Date,
    timeSlot: String,
    status: String,
    totalAmount: Number,
    type: String,
    payment: { type: Object, default: { status: 'unpaid' } }
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clean existing data
        await User.deleteMany({});
        await Service.deleteMany({});
        await Booking.deleteMany({});
        console.log('Cleared existing data');

        // Create Users
        const admin = await User.create({
            name: 'Admin User',
            mobile: '0000000000',
            role: 'admin'
        });

        const provider = await User.create({
            name: 'Rajesh Kumar',
            mobile: '9876543210',
            role: 'provider',
            providerInfo: { businessName: 'RK Home Services', experience: 5, isVerified: true }
        });

        const customer = await User.create({
            name: 'Amith Singh',
            mobile: '8888888888',
            role: 'customer'
        });

        console.log('Users created');

        // Create Services
        const s1 = await Service.create({
            providerId: provider._id,
            title: 'Professional Home Cleaning',
            description: 'Full house deep cleaning including kitchen and bathrooms.',
            type: 'service',
            category: 'Cleaning',
            pricing: { amount: 1500, unit: 'visit' },
            media: ['https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=400'],
            rating: 4.8,
            reviewCount: 12
        });

        const s2 = await Service.create({
            providerId: provider._id,
            title: 'AC Repair & Service',
            description: 'Filter cleaning and gas charging for all AC brands.',
            type: 'service',
            category: 'Repair',
            pricing: { amount: 800, unit: 'visit' },
            media: ['https://images.unsplash.com/photo-1590424600100-3486c9053805?auto=format&fit=crop&q=80&w=400'],
            rating: 4.5,
            reviewCount: 8
        });

        const r1 = await Service.create({
            providerId: provider._id,
            title: 'Heavy Duty Drilling Machine',
            description: 'Impact drill with bits set for concrete and wood.',
            type: 'rental',
            category: 'Tools',
            pricing: { amount: 300, unit: 'day' },
            media: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400'],
            rating: 4.2,
            reviewCount: 5
        });

        console.log('Services created');

        // Create Bookings
        await Booking.create({
            customerId: customer._id,
            providerId: provider._id,
            serviceId: s1._id,
            bookingDate: new Date(),
            timeSlot: '10:00 AM - 12:00 PM',
            status: 'pending',
            totalAmount: 1500,
            type: 'service'
        });

        await Booking.create({
            customerId: customer._id,
            providerId: provider._id,
            serviceId: s2._id,
            bookingDate: new Date(Date.now() - 86400000), // yesterday
            status: 'completed',
            totalAmount: 800,
            type: 'service',
            payment: { status: 'paid', method: 'Online' }
        });

        console.log('Bookings created');

        await mongoose.disconnect();
        console.log('Done!');
    } catch (error) {
        console.error('Error seeding:', error);
    }
}

seed();
