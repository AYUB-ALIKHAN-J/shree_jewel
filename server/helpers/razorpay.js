require("dotenv").config();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Use environment variable
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Use environment variable
});

module.exports = razorpay;
