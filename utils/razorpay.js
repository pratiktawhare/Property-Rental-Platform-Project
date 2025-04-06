const Razorpay = require('razorpay');
const crypto = require('crypto');

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

module.exports = {
    razorpay,
    verifyPayment
};
