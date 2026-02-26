
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://localhost:27017/servicehub";

async function check() {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('Collections in servicehub:');
        for (let col of collections) {
            const count = await conn.connection.db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count} documents`);
        }
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

check();
