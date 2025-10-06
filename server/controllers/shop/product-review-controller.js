const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { userId, userName, reviewMessage, reviewValue } = req.body;
    if (!userId || !reviewMessage || !reviewValue) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }
    const newReview = new ProductReview({
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });
    await newReview.save();
    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message || "Error",
    });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find({}).sort({ reviewValue: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addProductReview, getAllReviews };
