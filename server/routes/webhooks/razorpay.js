const express = require("express");
const crypto = require("crypto");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const router = express.Router();

router.post("/razorpay", express.json({ type: "*/*" }), async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const bodyStr = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(bodyStr)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.log("Signature mismatch");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const event = req.body.event;
    const payment = req.body.payload?.payment?.entity;

    if (!payment) {
      console.log("Missing payment payload");
      return res.status(400).json({ success: false, message: "Missing payment info" });
    }

    if (event === "payment.captured") {
      const { id: paymentId, order_id: razorpayOrderId } = payment;

      // Update order status to confirmed/paid
      const updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId },
        {
          orderStatus: "confirmed",
          paymentStatus: "paid",
          paymentId,
          orderUpdateDate: new Date(),
        },
        { new: true }
      );

      if (!updatedOrder) {
        console.log("Order not found for Razorpay Order ID:", razorpayOrderId);
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      // Reduce product stock
      if (updatedOrder.cartItems && updatedOrder.cartItems.length > 0) {
        const bulkOps = updatedOrder.cartItems.map(({ productId, quantity }) => ({
          updateOne: {
            filter: { _id: productId },
            update: { $inc: { totalStock: -quantity } }, // Use totalStock
          },
        }));
        await Product.bulkWrite(bulkOps);
      }

      // Delete the user's cart by id
      if (updatedOrder.cartId) {
        await Cart.findByIdAndDelete(updatedOrder.cartId);
      }

      console.log("Order updated, cart deleted, and inventory adjusted for order ID:", updatedOrder._id);

      return res.status(200).json({ success: true, message: "Order updated" });
    } else {
      console.log("Unrelated event:", event);
      return res.status(200).json({ success: true, message: "Event ignored" });
    }
  } catch (error) {
    console.error("Error in webhook:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
