const cloudinary = require("../config/cloudinary");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Cloudinary Upload Function
const uploadAvatarToCloudinary = async (avatarBase64, userId) => {
  try {
    const base64Image = avatarBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");

    const optimizedImage = await sharp(buffer)
      .resize({ width: 300, height: 300, fit: "cover" })
      .toFormat("jpeg")
      .toBuffer();

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `avatars/users/${userId}` }, // Save in a user-specific folder
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(optimizedImage);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading avatar to Cloudinary:", error);
    throw new Error("Avatar upload failed");
  }
};

const saveAvatarLocally = async (avatarBase64, userId) => {
  try {
    const base64Image = avatarBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");

    const userFolder = path.join(__dirname, "../public/avatars/users", userId); // User-specific folder
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true }); // Create folder if it doesn't exist
    }

    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `avatar_${timestamp}.jpg`;
    const filePath = path.join(userFolder, fileName);

    await sharp(buffer)
      .resize({ width: 300, height: 300, fit: "cover" })
      .toFormat("jpeg")
      .toFile(filePath);

    return `/public/avatars/users/${userId}/${fileName}`; // Return the unique avatar path
  } catch (error) {
    console.error("Error saving avatar locally:", error);
    throw new Error("Local avatar save failed");
  }
};

const deleteFromCloudinary = async (cloudinaryUrl) => {
  if (!cloudinaryUrl) return;

  try {
    // Extract the public ID correctly
    const urlParts = cloudinaryUrl.split("/");
    const fileName = urlParts[urlParts.length - 1].split(".")[0]; // Extract filename without extension
    const folderPath = urlParts.slice(7, urlParts.length - 1).join("/"); // Extract folder path after domain
    const publicId = `${folderPath}/${fileName}`;

    // console.log("Attempting to delete from Cloudinary:", publicId);

    // Call Cloudinary API
    const result = await cloudinary.uploader.destroy(publicId);

    // console.log("Cloudinary Deletion Response:", result); // Log response for debugging
  } catch (error) {
    console.error("Error deleting old avatar from Cloudinary:", error);
  }
};

// Function to delete old avatar from local storage
const deleteLocalAvatar = (userId) => {
  const filePath = path.join(
    __dirname,
    `../public/avatars/users/${userId}/avatar.jpg`
  );
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  uploadAvatarToCloudinary,
  saveAvatarLocally,
  deleteFromCloudinary,
  deleteLocalAvatar,
};
