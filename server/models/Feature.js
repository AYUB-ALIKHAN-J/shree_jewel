const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema(
  {
    imageDesktop: String, // Desktop/Laptop banner image
    imageMobile: String,  // Mobile banner image
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feature", FeatureSchema);
