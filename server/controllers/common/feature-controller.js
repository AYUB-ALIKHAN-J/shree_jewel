const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { imageDesktop, imageMobile } = req.body;

    const featureImages = new Feature({
      imageDesktop,
      imageMobile,
    });

    await featureImages.save();

    res.status(201).json({
      success: true,
      data: featureImages,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});
    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;
    const feature = await Feature.findByIdAndDelete(id);

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: "Feature image not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feature image deleted successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage };
