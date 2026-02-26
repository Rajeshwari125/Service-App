
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://localhost:27017";

async function check() {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        const admin = conn.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('Databases found:');
        dbs.databases.forEach(db => console.log(`- ${db.name}`));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

check();
