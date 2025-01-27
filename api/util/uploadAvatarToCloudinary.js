// const cloudinary = require("../config/cloudinary");
// const sharp = require("sharp");

// const uploadAvatarToCloudinary = async (avatarBase64) => {
//   try {
//     const base64Image = avatarBase64.replace(/^data:image\/\w+;base64,/, "");
//     const buffer = Buffer.from(base64Image, "base64");

//     const optimizedImage = await sharp(buffer)
//       .resize({ width: 300, height: 300, fit: "cover" })
//       .toFormat("jpeg")
//       .toBuffer();

//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream({ folder: "avatars" }, (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }).end(optimizedImage);
//     });

//     return result.secure_url;
//   } catch (error) {
//     console.error("Error uploading avatar to Cloudinary:", error);
//     throw new Error("Avatar upload failed");
//   }
// };

// module.exports = { uploadAvatarToCloudinary };




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
      cloudinary.uploader.upload_stream(
        { folder: `avatars/users/${userId}` }, // Save in a user-specific folder
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(optimizedImage);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading avatar to Cloudinary:", error);
    throw new Error("Avatar upload failed");
  }
};




// Local Storage Save Function
const saveAvatarLocally = async (avatarBase64, userId) => {
  try {
    const base64Image = avatarBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");

    const userFolder = path.join(__dirname, "../public/avatars/users", userId); // User-specific folder
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true }); // Create folder if it doesn't exist
    }

    const filePath = path.join(userFolder, "avatar.jpg");

    await sharp(buffer)
      .resize({ width: 300, height: 300, fit: "cover" })
      .toFormat("jpeg")
      .toFile(filePath);

    return `/public/avatars/users/${userId}/avatar.jpg`; // Return relative path
  } catch (error) {
    console.error("Error saving avatar locally:", error);
    throw new Error("Local avatar save failed");
  }
};


module.exports = {
  uploadAvatarToCloudinary,
  saveAvatarLocally,

};

