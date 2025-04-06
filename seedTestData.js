const mongoose = require('mongoose');
const User = require('./models/user.js');
const Listing = require('./models/listing.js');

// Sample listing data
const sampleListings = [
  {
    title: "Beachfront Villa",
    description: "Luxury villa with ocean view",
    price: 250,
    location: "Malibu, California",
    category: "Iconic Cities",
    geometry: {
      type: "Point",
      coordinates: [-118.6681, 34.0259]
    }
  },
  {
    title: "Mountain Cabin",
    description: "Cozy cabin with great views",
    price: 150, 
    location: "Aspen, Colorado",
    category: "Mountains",
    geometry: {
      type: "Point",
      coordinates: [-106.8231, 39.1911]
    }
  }
];

async function seedData() {
  try {
    // Connect to database
    await mongoose.connect('mongodb://localhost:27017/yourdbname');
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log('Cleared existing data');

    // Create test owner user
    const owner = new User({
      username: 'testowner',
      email: 'owner@test.com',
      phone: '1234567890',
      role: 'owner'
    });
    await owner.save();
    console.log('Created test owner:', owner.username);

    // Create test regular user  
    const user = new User({
      username: 'testuser', 
      email: 'user@test.com',
      phone: '0987654321',
      role: 'user'
    });
    await user.save();
    console.log('Created test user:', user.username);

    // Create listings owned by test owner
    for (const listingData of sampleListings) {
      const listing = new Listing({
        ...listingData,
        owner: owner._id
      });
      await listing.save();
      
      // Update owner's listings array
      await User.findByIdAndUpdate(owner._id, {
        $push: { listings: listing._id }
      });
      
      console.log('Created listing:', listing.title);
    }

    console.log('\nSeed completed successfully!');
    console.log('Test owner credentials:');
    console.log('Username: testowner');
    console.log('Password: (use your normal password)');
    process.exit(0);

  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seedData();
