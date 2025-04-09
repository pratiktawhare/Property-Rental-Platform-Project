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
    wrapAsync(listingController.verifyPayment)
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
                populate: [
                    {
                        path: 'user',
                        select: 'username email phone'
                    },
                    {
                        path: 'cancelledBy',
                        select: 'username'
                    }
                ]
            });
        res.render("listings/owner-dashboard", { listings });
    })
);

// Booking Cancellation Routes
router.get("/bookings/:id/cancel",
    isLoggedIn,
    wrapAsync(listingController.renderCancelForm)
);

router.post(["/bookings/:id/cancel", "/bookings/:id/cancel/"], 
    isLoggedIn,
    wrapAsync(listingController.cancelBooking)
);

// Booking Deletion Routes


// POST method route with _method=DELETE override
router.delete("/bookings/:id/delete", 
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
