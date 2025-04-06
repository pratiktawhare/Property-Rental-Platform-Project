const mongoose = require('mongoose');
const Listing = require('./models/listing');
const Booking = require('./models/booking');

async function testBookingRelationship() {
  try {
    await mongoose.connect('mongodb://localhost:27017/yourDatabaseName');
    
    // 1. Verify the booking exists
    const booking = await Booking.findById('67f2688e8a88df7be52ce30b');
    console.log('Found booking:', booking);
    
    // 2. Add booking to listing
    await Listing.findByIdAndUpdate(booking.listing, {
      $push: { bookings: booking._id }
    });
    
    // 3. Verify the listing now has the booking
    const listing = await Listing.findById(booking.listing).populate('bookings');
    console.log('Updated listing:', listing);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.connection.close();
  }
}

testBookingRelationship();
