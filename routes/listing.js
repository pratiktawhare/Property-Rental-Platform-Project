const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const User = require("../models/user.js");
const { verifyPayment } = require("../utils/razorpay.js");
const { isLoggedIn, isOwner, validateListing, checkAvailability } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage: storage }); // Use CloudinaryStorage here

//Index and Create Route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// Search Route
router.get("/search", wrapAsync(listingController.searchListings));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show, Update and Delete Route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Booking Routes
router.get("/:id/book", isLoggedIn, wrapAsync(listingController.renderBookingForm));
router.post("/:id/book", 
    isLoggedIn,
    wrapAsync(listingController.createBooking)
);

// Payment Verification Route
router.post("/bookings/verify-payment", 
    isLoggedIn,
    wrapAsync(async (req, res) => {
        const { 
            razorpay_payment_id, 
            razorpay_order_id, 
            razorpay_signature,
            bookingId 
        } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Verify payment signature
        const isValid = verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (isValid) {
            // Update booking status
            booking.paymentStatus = "completed";
            booking.razorpayPaymentId = razorpay_payment_id;
            booking.razorpaySignature = razorpay_signature;
            await booking.save();

            // Add booking to user's bookings array
            await User.findByIdAndUpdate(booking.user, {
                $push: { bookings: booking._id }
            });
            
            // Add booking to listing's bookings array
            await Listing.findByIdAndUpdate(booking.listing, {
                $push: { bookings: booking._id }
            });

            return res.json({ 
                success: true,
                bookingId: booking._id
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: "Payment verification failed" 
            });
        }
    })
);

router.get("/:id/owner-bookings", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: 'bookings',
        populate: {
            path: 'user',
            select: 'username email phone'
        }
    });
    res.render("listings/owner-bookings", { listing });
}));

// Owner Dashboard - All Listings with Bookings
router.get("/owner/all-bookings", 
    isLoggedIn, 
    wrapAsync(async (req, res) => {
        const listings = await Listing.find({ owner: req.user._id })
            .populate({
                path: 'bookings',
                populate: {
                    path: 'user',
                    select: 'username email phone'
                }
            });
        res.render("listings/owner-dashboard", { listings });
    })
);

// Booking Cancellation Route
router.post(["/bookings/:id/cancel", "/bookings/:id/cancel/"], 
    isLoggedIn,
    wrapAsync(listingController.cancelBooking)
);

// Booking Deletion Routes
// DELETE method routes
router.delete(["/bookings/:id/delete", "/bookings/:id/delete/"], 
    isLoggedIn,
    wrapAsync(listingController.deleteBooking)
);

router.delete(["/bookings/:id", "/bookings/:id/"], 
    isLoggedIn,
    wrapAsync(listingController.deleteBooking)
);

// POST method routes with _method=DELETE override
router.post(["/bookings/:id/delete", "/bookings/:id/delete/"], 
    isLoggedIn,
    wrapAsync(listingController.deleteBooking)
);

router.post(["/bookings/:id", "/bookings/:id/"], 
    isLoggedIn,
    wrapAsync(listingController.deleteBooking)
);

// Get booked dates for a listing
router.get("/:id/booked-dates", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const bookings = await Booking.find({
        listing: id,
        status: { $ne: "cancelled" }
    }).select('checkIn checkOut');
    
    res.json({
        bookedDates: bookings.map(b => ({
            from: b.checkIn,
            to: b.checkOut
        }))
    });
}));

module.exports = router;
