const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
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
const hpp = require("hpp"); // HTTP Parameter Pollution protection
const xss = require("xss-clean"); // XSS protection

// --- Async error handler utility ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Database connection is now securely configured using environment variables.

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// --- Express app setup ---
const app = express();
const PORT = process.env.PORT || 5000;

// Validate environment variables
validateEnv();

// Trust proxy for nginx reverse proxy
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting - more reasonable limits
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs for auth routes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Prevent MongoDB operator injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

app.use(
  cors({
    origin: [
      process.env.CLIENT_ORIGIN || "https://127.0.0.1:3443",
      "https://127.0.0.1:3000",
      "http://127.0.0.1:3000"
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// --- Health check endpoint ---
app.get("/health", healthCheck);

// --- API routes with rate limiting ---
// Auth routes with moderate rate limiting
app.use("/api/auth", authLimiter, authRouter);

// Admin routes with standard rate limiting
app.use("/api/admin/products", apiLimiter, adminProductsRouter);
app.use("/api/admin/orders", apiLimiter, adminOrderRouter);

// Shop routes with standard rate limiting
app.use("/api/shop/products", apiLimiter, shopProductsRouter);
app.use("/api/shop/cart", apiLimiter, shopCartRouter);
app.use("/api/shop/address", apiLimiter, shopAddressRouter);
app.use("/api/shop/order", apiLimiter, shopOrderRouter);
app.use("/api/shop/search", apiLimiter, shopSearchRouter);
app.use("/api/shop/review", apiLimiter, shopReviewRouter);

// Common routes with standard rate limiting
app.use("/api/common/feature", apiLimiter, commonFeatureRouter);
app.use("/api/common/categories", apiLimiter, categoriesRouter);
app.use("/api/common/subcategories", apiLimiter, subcategoriesRouter);
app.use("/api/common/countries", apiLimiter, countriesRouter);

// Webhooks with no rate limiting (required for payment processing)
app.use("/api/webhooks", razorpayWebhookRouter);

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// --- Start server and handle process-level errors ---
let server;

// Check if SSL certificates exist
const sslCertPath = process.env.SSL_CERT_PATH || "/etc/ssl/certs/cert.pem";
const sslKeyPath = process.env.SSL_KEY_PATH || "/etc/ssl/private/key.pem";

if (fs.existsSync(sslCertPath) && fs.existsSync(sslKeyPath)) {
  // HTTPS server
  const options = {
    cert: fs.readFileSync(sslCertPath),
    key: fs.readFileSync(sslKeyPath)
  };
  
  server = https.createServer(options, app).listen(PORT, () =>
    console.log(`HTTPS Server is now running on port ${PORT}`)
  );
} else {
  // HTTP server (fallback)
  server = app.listen(PORT, () =>
    console.log(`HTTP Server is now running on port ${PORT}`)
  );
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully.");
  server.close(() => process.exit(0));
});
