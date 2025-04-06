const mongoose = require('mongoose');
const User = require('./models/user.js');
const Listing = require('./models/listing.js');

async function migrate() {
  try {
    await mongoose.connect('mongodb://localhost:27017/yourdbname', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const listings = await Listing.find({});
    let count = 0;

    for (const listing of listings) {
      const result = await User.updateOne(
        { _id: listing.owner },
        { $addToSet: { listings: listing._id } }
      );
      if (result.modifiedCount) count++;
    }

    console.log(`Updated ${count} user listings arrays`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
