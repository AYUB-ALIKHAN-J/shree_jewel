const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");
const categoriesRouter = require("./routes/common/categories");
const subcategoriesRouter = require("./routes/common/subcategories");
const countriesRouter = require("./routes/common/countries");
const razorpayWebhookRouter = require("./routes/webhooks/razorpay");
const healthCheck = require("./health");
const validateEnv = require("./config/validateEnv");

// --- Security and stability middleware ---
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const xss = require("xss-clean");

// --- Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// --- Express app setup ---
const app = express();
const PORT = process.env.PORT || 5000;

validateEnv();
app.set('trust proxy', 1); // Important for rate-limiting behind a proxy
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // Set this to https://shreejewelpalace.com
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// --- API routes ---
app.use("/api", apiLimiter); // Apply general rate limiting to all /api routes
app.get("/health", healthCheck);
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/common/categories", categoriesRouter);
app.use("/api/common/subcategories", subcategoriesRouter);
app.use("/api/common/countries", countriesRouter);
app.use("/api/webhooks", razorpayWebhookRouter);

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// --- Start HTTP Server ---
// The server MUST only start as an HTTP server. Nginx handles HTTPS.
const server = app.listen(PORT, () =>
  console.log(`HTTP Server is now running on port ${PORT}`)
);

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  server.close(() => process.exit(1));
});
