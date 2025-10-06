const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage, // add this
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);
router.delete("/delete/:id", deleteFeatureImage); // add this

module.exports = router;
