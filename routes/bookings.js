const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Booking = require('../models/booking');
const Listing = require('../models/listing');

// Calculate booking price with discounts
const calculateBookingPrice = (basePrice, nights, userType) => {
  const subtotal = basePrice * nights;
  let discountAmount = 0;
  
  console.log('Applying discount for userType:', userType);
  if (userType === 'student') {
    discountAmount = subtotal * 0.15; // 15% student discount
    console.log('Applied 15% student discount:', discountAmount);
  } else if (userType === 'military') {
    discountAmount = subtotal * 0.20; // 20% military discount
    console.log('Applied 20% military discount:', discountAmount);
  } else {
    console.log('No discount applied for userType:', userType);
  }

  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.18; // 18% tax
  const totalPrice = discountedSubtotal + tax;

  return {
    subtotal,
    discountAmount,
    tax,
    totalPrice
  };
};

// Create booking
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;
    const user = req.user;
    console.log('Creating booking for user:', {
      id: user._id,
      username: user.username, 
      userType: user.userType
    });
    
    const listing = await Listing.findById(listingId);
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    
    const { subtotal, discountAmount, tax, totalPrice } = calculateBookingPrice(
      listing.price,
      nights,
      user.userType
    );

    const booking = await Booking.create({
      listing: listingId,
      user: user._id,
      checkIn,
      checkOut,
      guests,
      subtotal,
      discountAmount,
      tax,
      totalPrice,
      userType: user.userType
    });

    res.status(201).json({ booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Other booking routes would go here...

module.exports = router;
