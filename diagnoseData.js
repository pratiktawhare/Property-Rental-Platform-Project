const mongoose = require('mongoose');
const User = require('./models/user.js');
const Listing = require('./models/listing.js');

async function diagnose() {
  try {
    // Connect to database (update connection string if needed)
    await mongoose.connect('mongodb://localhost:27017/yourdbname');
    console.log('Connected to database');

    // Check listings
    const listings = await Listing.find({}).limit(2).lean();
    console.log('\nSample Listings:');
    console.log(listings.map(l => ({
      _id: l._id,
      title: l.title,
      owner: l.owner,
      ownerType: typeof l.owner
    })));

    // Check users
    const users = await User.find({}).limit(2).lean();
    console.log('\nSample Users:');
    console.log(users.map(u => ({
      _id: u._id, 
      username: u.username,
      listingsCount: u.listings?.length || 0
    })));

    // Check for orphaned listings (owner not in users)
    const allListings = await Listing.find({}).lean();
    const allUserIds = (await User.find({}, '_id')).map(u => u._id.toString());
    
    const orphanedListings = allListings.filter(
      l => !allUserIds.includes(l.owner?.toString())
    );
    
    console.log(`\nFound ${orphanedListings.length} orphaned listings`);
    process.exit(0);

  } catch (err) {
    console.error('Diagnostic failed:', err);
    process.exit(1);
  }
}

diagnose();
