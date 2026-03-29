const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/servicehub";

async function check() {
    await mongoose.connect(MONGODB_URI);
    const Service = mongoose.model('Service', new mongoose.Schema({ title: String, media: [String] }));
    const services = await Service.find({});
    console.log(JSON.stringify(services, null, 2));
    process.exit(0);
}

check();
