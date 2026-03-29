const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://localhost:27017/servicehub";
const IMG = "https://images.unsplash.com/photo-";

async function forceFix() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const Service = mongoose.model('Service', new mongoose.Schema({
    title: String,
    category: String,
    media: [String],
  }));

  const all = await Service.find({});
  console.log(`Found ${all.length} total services`);

  for (const s of all) {
    let hasImage = s.media && s.media.length > 0 && s.media[0] && s.media[0].startsWith('http');
    if (!hasImage) {
      const imgMap = {
        'Cleaning': IMG + "1581578731548-c64695cc6952?w=800",
        'Plumbing': IMG + "1585704032915-9e4a413f5a45?w=800",
        'Electrician': IMG + "1621905251189-08b02d171c20?w=800",
        'Painting': IMG + "1562259949-e8e7689d7828?w=800",
        'AC Service': IMG + "1504328345606-18bbc8c9d7d1?w=800"
      };
      const newImg = imgMap[s.category] || (IMG + "1584622650111-993a426bc7e4?w=800");
      s.media = [newImg];
      await s.save();
      console.log(`Updated [${s.category}]: ${s.title}`);
    }
  }

  console.log('Force fix complete');
  process.exit(0);
}

forceFix();
