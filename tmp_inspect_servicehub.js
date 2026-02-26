
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://localhost:27017/servicehub";

async function check() {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('Collections in servicehub:');
        collections.forEach(col => console.log(`- ${col.name}`));

        for (const col of collections) {
            const count = await conn.connection.db.collection(col.name).countDocuments();
            console.log(`  Count for ${col.name}: ${count}`);
            if (count > 0) {
                const lastDocs = await conn.connection.db.collection(col.name).find().sort({ _id: -1 }).limit(2).toArray();
                console.log(`  Latest docs in ${col.name}:`, JSON.stringify(lastDocs, null, 2));
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

check();
