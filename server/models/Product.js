const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    images: [String], // changed from image: String
    title: String,
    details: {
      material: String,
      design: String,
      motif: String,
      craftsmanship: String,
      wearability: String,
    },
    category: String,
    subcategory: String,
    youtubeLink: String,      
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
