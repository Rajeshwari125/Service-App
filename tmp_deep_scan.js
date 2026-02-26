
const mongoose = require('mongoose');

async function checkAll() {
    const URI = "mongodb://127.0.0.1:27017";
    try {
        const conn = await mongoose.connect(URI);
        const admin = conn.connection.db.admin();
        const dbs = await admin.listDatabases();

        console.log(`Found ${dbs.databases.length} databases.`);

        for (const dbInfo of dbs.databases) {
            if (['admin', 'config', 'local'].includes(dbInfo.name)) continue;

            console.log(`\nChecking database: ${dbInfo.name}`);
            const db = conn.connection.useDb(dbInfo.name);
            const collections = await db.db.listCollections().toArray();

            for (const col of collections) {
                const count = await db.db.collection(col.name).countDocuments();
                console.log(`  - ${col.name}: ${count} docs`);
                if (count > 0) {
                    const sample = await db.db.collection(col.name).find().sort({ _id: -1 }).limit(1).toArray();
                    console.log(`    Latest: ${JSON.stringify(sample[0])}`);
                }
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkAll();
