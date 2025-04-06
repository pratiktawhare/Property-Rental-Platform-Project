const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkIn: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value >= new Date().setHours(0,0,0,0);
            },
            message: 'Check-in date cannot be in the past'
        }
    },
    checkOut: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.checkIn;
            },
            message: 'Check-out must be after check-in'
        }
    },
    guests: {
        type: Number,
        required: true,
        min: 1
    },
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending"
    },
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    status: {
        type: String,
        enum: ["confirmed", "cancelled", "completed"],
        default: "confirmed"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    cancelledAt: {
        type: Date
    },
    cancelledBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    cancellationReason: {
        type: String,
        maxlength: 500
    }
});

// Add indexes for better query performance
bookingSchema.index({ listing: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ checkIn: 1 });
bookingSchema.index({ checkOut: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
