const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dphxdgu4n",
  api_key: "725173318224623",
  api_secret: "JyoXw9zg-GyAq7WXhJ-MdurSvR4",
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "shree_jewell",
    chunk_size: 8388608, // 8MB in bytes
    eager: [
      { width: 1000, height: 1000, crop: "limit" },
      { width: 800, height: 800, crop: "limit" }
    ],
    eager_async: true,
    //eager_notification_url: "https://your-domain.com/webhook"
  });

  return result;
}

async function imageDeleteUtil(publicId) {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
}

// Configure multer to accept larger files (8MB)
const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB in bytes
  }
});

module.exports = { upload, imageUploadUtil, imageDeleteUtil };
