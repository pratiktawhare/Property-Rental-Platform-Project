const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/booking');

// Initialize Razorpay client only if credentials exist
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
}

// Payment verification function
function verifyPayment(orderId, paymentId, signature) {
    if (!razorpay) {
        // If Razorpay isn't configured, auto-verify for testing
        return true;
    }

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    return generatedSignature === signature;
}

// Webhook verification
async function handleWebhook(payload, signature) {
    if (!razorpay) {
        return { success: false, message: "Razorpay not configured" };
    }

    // Verify webhook signature
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest('hex');

    if (generatedSignature !== signature) {
        return { success: false, message: "Invalid webhook signature" };
    }

    try {
        const { 
            entity: event,
            payload: { 
                payment: { 
                    entity: payment 
                } 
            } 
        } = payload;

        // Handle payment capture event
        if (event === 'payment.captured') {
            const booking = await Booking.findOne({ 
                razorpayOrderId: payment.order_id 
            }).populate('listing user');

            if (!booking) {
                return { success: false, message: "Booking not found" };
            }

            // Verify payment
            const isValid = verifyPayment(
                payment.order_id,
                payment.id,
                payment.signature
            );

            if (isValid) {
                // Update booking status
                booking.paymentStatus = "completed";
                booking.status = "confirmed";
                booking.razorpayPaymentId = payment.id;
                booking.razorpaySignature = payment.signature;
                await booking.save();

                // Add booking references
                await User.findByIdAndUpdate(booking.user._id, {
                    $push: { bookings: booking._id }
                });
                
                await Listing.findByIdAndUpdate(booking.listing._id, {
                    $push: { bookings: booking._id }
                });

                return { 
                    success: true,
                    message: "Payment processed and booking confirmed"
                };
            }
        }

        return { success: false, message: "Unhandled webhook event" };
    } catch (err) {
        console.error("Webhook processing error:", err);
        return { 
            success: false, 
            message: "Error processing webhook" 
        };
    }
}

module.exports = {
    razorpay,
    verifyPayment,
    handleWebhook
};
