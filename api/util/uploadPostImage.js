const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

const uploadPostImage = async (imageBase64, userId) => {
  try {
    const base64Image = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `images/users/${userId}` }, 
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    return result.secure_url; 
  } catch (error) {
    console.error("Error uploading post image to Cloudinary:", error);
    throw new Error("Post image upload failed");
  }
};


const savePostImageLocally = async (imageBase64, userId) => {
  try {
    const base64Image = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");

    const userFolder = path.join(__dirname, "../public/Images/users", userId); // User-specific folder for post images
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true }); // Create folder if it doesn't exist
    }

    const timestamp = Date.now(); // Use timestamp to make filenames unique
    const filePath = path.join(userFolder, `image_${timestamp}.jpg`); // Save with a unique filename

    // Save the image to file
    await fs.promises.writeFile(filePath, buffer);

    return `/public/Images/users/${userId}/image_${timestamp}.jpg`; // Return relative path
  } catch (error) {
    console.error("Error saving post image locally:", error);
    throw new Error("Local post image save failed");
  }
};

module.exports = {
  uploadPostImage,
  savePostImageLocally,
};
