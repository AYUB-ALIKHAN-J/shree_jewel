const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Subcategory = require("../../models/Subcategory");

const handleImageUpload = async (req, res) => {
  try {
    // Support both single and multiple file uploads
    const files = req.files || (req.file ? [req.file] : []);
    if (!files.length) {
      return res.status(400).json({
        success: false,
        message: "No file(s) uploaded",
      });
    }

    // Upload all images and collect their URLs
    const uploadResults = [];
    for (const file of files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const url = "data:" + file.mimetype + ";base64," + b64;
      const result = await imageUploadUtil(url);
      uploadResults.push(result);
    }

    res.json({
      success: true,
      results: uploadResults,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      images, // changed from image
      title,
      details,
      category,
      subcategory,
      youtubeLink,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    // Fetch category name using its ID
    const categoryDoc = await Category.findById(category);

    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // Handle optional subcategory
    let subcategoryName = "";
    if (subcategory) {
      const subcategoryDoc = await Subcategory.findById(subcategory);
      if (!subcategoryDoc) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory ID",
      });
      }
      subcategoryName = subcategoryDoc.name;
    }

    const newlyCreatedProduct = new Product({
      images, // changed from image
      title,
      details,
      category: categoryDoc.name,
      subcategory: subcategoryName,
      youtubeLink,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      images,
      title,
      details,
      category,
      subcategory,
      youtubeLink,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    // If category is an ID, fetch its name
    let categoryName = category;
    if (category && category.length === 24) {
      const categoryDoc = await Category.findById(category);
      if (categoryDoc) categoryName = categoryDoc.name;
    }

    // If subcategory is an ID, fetch its name
    let subcategoryName = "";
    if (subcategory && subcategory.length === 24) {
      const subcategoryDoc = await Subcategory.findById(subcategory);
      if (subcategoryDoc) subcategoryName = subcategoryDoc.name;
    } else if (subcategory) {
      subcategoryName = subcategory;
    }

    findProduct.title = title || findProduct.title;
    findProduct.details = details || findProduct.details;
    findProduct.category = categoryName || findProduct.category;
    findProduct.subcategory = subcategoryName || findProduct.subcategory;
    findProduct.youtubeLink = youtubeLink || findProduct.youtubeLink;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    // Only update images if provided and is a non-empty array
    if (Array.isArray(images) && images.length > 0) {
      findProduct.images = images;
    }
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
