const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
  verifyRazorpayPayment,
  downloadInvoice,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.post("/verify-razorpay", verifyRazorpayPayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
router.post("/invoice/:orderId", downloadInvoice);
router.get("/test-invoice", (req, res) => {
  res.json({ message: "Invoice endpoint is working" });
});

module.exports = router;
