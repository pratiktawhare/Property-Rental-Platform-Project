const Listing = require("../models/listing");
const User = require("../models/user");
const Booking = require("../models/booking");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
const { category } = req.query;
const query = category ? { category } : {};
const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { 
        allListings,
        query: req.query 
    });
};

module.exports.searchListings = async (req, res) => {
    const { q, category, minPrice, maxPrice, location } = req.query;
    const query = {};
    
    // Text search
    if (q) {
        query.$or = [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } }
        ];
    }

    // Category filter
    if (category) {
        query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Location filter (basic implementation)
    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }

    const results = await Listing.find(query);
    res.render("listings/index.ejs", { 
        allListings: results,
        query: req.query 
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path : "reviews",
            populate: {
                path: "author"
            }
        }).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let response;
    try {
        response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location ,
        limit: 1
    })
    .send();

    
    } catch (error) {
        req.flash("error", "Geocoding failed. Please check the location.");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename}; 
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    
    // Add listing to user's listings array
    await User.findByIdAndUpdate(req.user._id, {
        $push: { listings: savedListing._id }
    });
    
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/uplaod", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    let response;
    try {
        response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location ,
        limit: 1
    })
    .send();

    
    } catch (error) {
        req.flash("error", "Geocoding failed. Please check the location.");
        return res.redirect("/listings/new");
    }

    listing.geometry = response.body.features[0].geometry;
    await listing.save();
    
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };

        await listing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
};

module.exports.renderCancelForm = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id)
            .populate('listing');
        
        if (!booking) {
            req.flash("error", "Booking not found");
            return res.redirect("/users/dashboard");
        }

        // Calculate days until check-in
        const now = new Date();
        const checkIn = new Date(booking.checkIn);
        const daysUntilCheckIn = Math.floor((checkIn - now) / (1000 * 60 * 60 * 24));

        res.render("bookings/cancel", { 
            booking,
            daysUntilCheckIn 
        });
    } catch (err) {
        console.error("Error rendering cancel form:", err);
        req.flash("error", "Failed to load cancellation form");
        res.redirect("/users/dashboard");
    }
};

module.exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const booking = await Booking.findById(id)
            .populate('user')
            .populate('listing');
        
        if (!booking) {
            req.flash("error", "Booking not found");
            return res.redirect("/users/dashboard");
        }

        // Check authorization - either user who booked or listing owner
        const isUser = booking.user.equals(req.user._id);
        const isOwner = booking.listing.owner.equals(req.user._id);
        
        if (!isUser && !isOwner) {
            req.flash("error", "Unauthorized action");
            return res.redirect("/users/dashboard");
        }

        // Check if booking can be cancelled
        if (booking.status === 'cancelled') {
            req.flash("error", "Booking already cancelled");
            return res.redirect("/users/dashboard");
        }

        if (booking.status === 'completed') {
            req.flash("error", "Completed bookings cannot be cancelled");
            return res.redirect("/users/dashboard");
        }

        // Calculate time until check-in
        const now = new Date();
        const checkIn = new Date(booking.checkIn);
        const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);
        
        if (hoursUntilCheckIn < 48) {
            req.flash("error", "Cancellations must be made at least 48 hours before check-in");
            return res.redirect("/users/dashboard");
        }

        // Calculate refund amount based on cancellation policy
        let refundAmount = booking.totalPrice;
        if (hoursUntilCheckIn < 168) { // 7 days = 168 hours
            refundAmount = booking.totalPrice * 0.5;
        }

        // Process refund if payment was completed
        if (booking.paymentStatus === 'completed') {
            // Handle test mode when Razorpay isn't configured
            if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
                booking.refundAmount = refundAmount;
                booking.paymentStatus = 'refunded';
                console.log("Test mode: Virtual refund processed");
            } else {
                try {
                    const razorpayRefundAmount = refundAmount * 100; // Convert to paise
                    
                    if (razorpayRefundAmount > 0) {
                        const refund = await razorpay.payments.refund(booking.razorpayPaymentId, {
                            amount: razorpayRefundAmount,
                            speed: "normal",
                            notes: {
                                reason: reason || "No reason provided",
                                cancelled_by: req.user._id.toString(),
                                booking_id: booking._id.toString()
                            }
                        });
                        
                        booking.refundId = refund.id;
                        booking.refundAmount = refundAmount;
                    }
                    
                    booking.paymentStatus = 'refunded';
                } catch (err) {
                    console.error("Refund processing error:", err);
                    booking.paymentStatus = 'refund_failed';
                }
            }
        }

        // Update booking status
        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        booking.cancelledBy = req.user._id;
        booking.cancellationReason = reason;
        await booking.save();

        req.flash("success", "Booking cancelled successfully");
        return res.redirect("/users/dashboard");
    } catch (err) {
        console.error("Booking cancellation error:", err);
        req.flash("error", "Failed to cancel booking");
        res.redirect("/users/dashboard");
    }
};

module.exports.renderBookingForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    
    // Initialize empty booking object for new bookings
    const booking = {
        status: 'pending',
        user: req.user,
        listing: listing
    };
    
    res.render("bookings/new.ejs", { 
        listing,
        booking,
        currentUser: req.user 
    });
};

const { checkAvailability } = require('../middleware/availability');

module.exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByIdAndDelete(id);
        
        if (!booking) {
            req.flash("error", "Booking not found");
            return res.redirect("back");
        }
        
        // Remove booking reference from user
        await User.findByIdAndUpdate(booking.user, {
            $pull: { bookings: booking._id }
        });
        
        // Remove booking reference from listing
        await Listing.findByIdAndUpdate(booking.listing, {
            $pull: { bookings: booking._id }
        });
        
        req.flash("success", "Booking deleted successfully");
        res.redirect("back");
    } catch (err) {
        console.error("Booking deletion error:", err);
        req.flash("error", "Failed to delete booking");
        res.redirect("back");
    }
};

module.exports.createBooking = async (req, res) => {
    try {
        // First check availability
        await checkAvailability(req, res, () => {});
        
        const { id } = req.params;
        const { checkIn, checkOut, guests, totalPrice, subtotal, tax } = req.body;
    
        // Validate required fields
        if (!checkIn || !checkOut || !guests || !totalPrice || !subtotal || !tax) {
            return res.status(400).json({
                success: false,
                message: "All booking fields are required"
            });
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found"
            });
        }

        // Create booking with pending payment status
        const booking = new Booking({
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests: parseInt(guests),
            subtotal: parseFloat(subtotal),
            tax: parseFloat(tax),
            totalPrice: parseFloat(totalPrice),
            listing: listing._id,
            user: req.user._id,
            paymentStatus: "pending"
        });

        // Save booking temporarily (will confirm after payment)
        await booking.save();

        // Handle test mode when Razorpay isn't configured
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            booking.paymentStatus = "completed";
            await booking.save();
            
            // Add booking to user's bookings
            await User.findByIdAndUpdate(req.user._id, {
                $push: { bookings: booking._id }
            });
            
            // Add booking to listing's bookings
            await Listing.findByIdAndUpdate(listing._id, {
                $push: { bookings: booking._id }
            });
            
            req.flash("success", "Booking created successfully! (Test Mode)");
            return res.redirect(`/listings/${id}`);
        }

        // Proceed with Razorpay payment flow
        const order = await razorpay.orders.create({
            amount: totalPrice * 100,
            currency: "INR",
            receipt: `booking_${booking._id}`,
            notes: {
                bookingId: booking._id.toString(),
                userId: req.user._id.toString()
            }
        });

        booking.razorpayOrderId = order.id;
        await booking.save();

        return res.render("bookings/payment", {
            booking,
            order,
            key_id: process.env.RAZORPAY_KEY_ID,
            listing
        });
    } catch (err) {
        console.error("Booking creation error - Full Error:", err);
        console.log("Request Body:", req.body);
        console.log("User ID:", req.user?._id);
        console.log("Listing ID:", req.params.id);
        
        // Detailed error messages
        let errorMessage = "Failed to create booking. Please try again.";
        if (err.name === 'ValidationError') {
            errorMessage = `Validation Error: ${Object.values(err.errors).map(val => val.message).join(', ')}`;
        } else if (err.name === 'CastError') {
            errorMessage = `Data Type Error: Invalid format for ${err.path}: ${err.value}`;
        } else if (err.code === 11000) {
            errorMessage = "Duplicate booking detected";
        } else if (err.message.includes('timeout')) {
            errorMessage = "Database operation timed out";
        }
        
        console.error("Final Error Message:", errorMessage);
        req.flash("error", errorMessage);
        return res.redirect(`/listings/${req.params.id}/book`);
    }
}

