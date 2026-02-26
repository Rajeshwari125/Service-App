
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createUser() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Remove existing with this number to ensure clean create
        await User.deleteOne({ mobile: '1234567890' });

        const user = await User.create({
            name: 'we',
            mobile: '1234567890',
            role: 'employee',
        });

        console.log('User created:', user.name, user.mobile);
        await mongoose.disconnect();
    } catch (e) {
        console.error('Error:', e);
    }
}

createUser();
