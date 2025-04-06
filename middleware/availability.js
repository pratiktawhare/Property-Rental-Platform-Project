const Booking = require("../models/booking");
const ExpressError = require("../utils/ExpressError");

module.exports.checkAvailability = async (req, res, next) => {
    const { listing, checkIn, checkOut } = req.body;
    
    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
        listing,
        $or: [
            { 
                checkIn: { $lt: new Date(checkOut) },
                checkOut: { $gt: new Date(checkIn) }
            },
            {
                checkIn: { $gte: new Date(checkIn), $lt: new Date(checkOut) }
            },
            {
                checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) }
            }
        ],
        status: { $ne: "cancelled" } // Ignore cancelled bookings
    });

    if (overlappingBookings.length > 0) {
        const bookedDates = overlappingBookings.map(booking => ({
            from: booking.checkIn,
            to: booking.checkOut
        }));
        const error = new ExpressError({
            message: "These dates are already booked",
            statusCode: 400,
            bookedDates
        });
        error.accepts = ['json'];
        throw error;
    }
    next();
};
