const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    phone: String,
    notes: String,
    isGift: { type: Boolean, default: false },
    giftMessage: { type: String, default: "" },
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: { type: String, default: "pending" },
  totalAmount: Number,
  subtotal: Number,
  taxAmount: Number,
  shippingCharges: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  razorpayOrderId: String, // Store Razorpay order ID for webhook matching
  paymentId: String,
  payerId: String,
},
{ 
  timestamps: true 
});

module.exports = mongoose.model("Order", OrderSchema);
