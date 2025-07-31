const paypal = require("../../helpers/paypal");
const razorpay = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");
const crypto = require("crypto");
const InvoiceGenerator = require("../../helpers/invoice-generator");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      subtotal,
      taxAmount,
      shippingCharges,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // Ensure isGift and giftMessage are present in addressInfo
    const safeAddressInfo = {
      ...addressInfo,
      isGift: addressInfo?.isGift || false,
      giftMessage: addressInfo?.giftMessage || "",
    };

    if (paymentMethod === "razorpay") {
      // Razorpay expects amount in paise
      const options = {
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`,
      };
      const razorpayOrder = await razorpay.orders.create(options);
      const newlyCreatedOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo: safeAddressInfo,
        orderStatus,
        paymentMethod,
        totalAmount,
        subtotal,
        taxAmount,
        shippingCharges,
        orderDate,
        orderUpdateDate,
        razorpayOrderId: razorpayOrder.id, // Store Razorpay order ID
      });
      await newlyCreatedOrder.save();
      return res.status(201).json({
        success: true,
        razorpayOrder,
        orderId: newlyCreatedOrder._id,
      });
    }

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo: safeAddressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      subtotal,
      taxAmount,
      shippingCharges,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.log("Order creation error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    //console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    //console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    //console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// Razorpay signature verification endpoint
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // Optionally update order status here
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "paid", paymentId: razorpay_payment_id });
      return res.json({ success: true, message: "Payment verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (e) {
    //console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// Download invoice as PDF
const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;

    console.log("Download invoice request:", { orderId, userId });

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      console.log("Order not found:", orderId);
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify user owns this order
    if (order.userId !== userId) {
      console.log("Access denied for user:", userId, "order:", orderId);
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Generating PDF for order:", orderId);

    // Generate PDF invoice
    const invoiceGenerator = new InvoiceGenerator();
    const pdfBuffer = await invoiceGenerator.generatePDFBuffer(order, user);

    console.log("PDF generated, size:", pdfBuffer.length, "bytes");

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${orderId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');

    // Send the PDF
    res.send(pdfBuffer);

    console.log("PDF sent successfully");

  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating invoice",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  verifyRazorpayPayment,
  downloadInvoice,
};
