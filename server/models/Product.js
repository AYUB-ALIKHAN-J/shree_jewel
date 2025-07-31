const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    images: [String], // changed from image: String
    title: String,
    description: String,
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
