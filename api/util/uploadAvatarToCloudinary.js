const cloudinary = require("../config/cloudinary");
const sharp = require("sharp");

const uploadAvatarToCloudinary = async (avatarBase64) => {
  try {
    const base64Image = avatarBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");

    const optimizedImage = await sharp(buffer)
      .resize({ width: 300, height: 300, fit: "cover" })
      .toFormat("jpeg")
      .toBuffer();

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "avatars" }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(optimizedImage);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading avatar to Cloudinary:", error);
    throw new Error("Avatar upload failed");
  }
};

module.exports = { uploadAvatarToCloudinary };
