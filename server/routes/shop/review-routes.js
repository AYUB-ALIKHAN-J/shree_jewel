const express = require("express");
const {
  addProductReview,
  getAllReviews,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", addProductReview);
router.get("/all", getAllReviews);

module.exports = router;
