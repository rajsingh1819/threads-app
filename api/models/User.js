const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  emailorphone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {
    cloudinary: { type: String }, // URL of the avatar on Cloudinary
    local: { type: String }, // Local path of the avatar
  },
  joinDate: { type: Date, default: Date.now },
  sentFollowRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  receivedFollowRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  verified: { type: Boolean, default: false },
  isPrivate: { type: Boolean, default: false },
  verificationToken: String,
  role: { type: String, default: "user" },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
