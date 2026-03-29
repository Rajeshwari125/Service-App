const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://localhost:27017/servicehub";
const IMG = "https://images.unsplash.com/photo-";

const ServiceSchema = new mongoose.Schema({
  title: String,
  category: String,
  media: [String],
});

const Service = mongoose.model('Service', ServiceSchema);

async function fix() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const services = await Service.find({ 
    $or: [
      { media: { $size: 0 } },
      { media: { $exists: false } }
    ]
  });

  console.log(`Found ${services.length} services with missing media`);

  const imageMap = {
    'Cleaning': IMG + "1581578731548-c64695cc6952?w=800",
    'Plumbing': IMG + "1585704032915-9e4a413f5a45?w=800",
    'Electrician': IMG + "1621905251189-08b02d171c20?w=800",
    'Painting': IMG + "1562259949-e8e7689d7828?w=800",
    'Interior': IMG + "1556909114-f6e7ad7d3136?w=800",
    'Security': IMG + "1558618666-fcd25c85b64e?w=800",
    'Moving': IMG + "1504328345606-18bbc8c9d7d1?w=800",
    'Repairs': IMG + "1581094794329-c8112a89af12?w=800",
    'AC Service': IMG + "1504328345606-18bbc8c9d7d1?w=800"
  };

  for (const service of services) {
    const defaultImg = imageMap[service.category] || (IMG + "1584622650111-993a426bc7e4?w=800");
    service.media = [defaultImg];
    await service.save();
    console.log(`Updated service: ${service.title}`);
  }

  console.log('Done fixing images');
  process.exit(0);
}

fix();
