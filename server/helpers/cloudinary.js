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
    folder:"shree_jewell"
  });

  return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
