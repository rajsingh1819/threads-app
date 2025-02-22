const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../util/sendVerificationEmail");

const {
  uploadAvatarToCloudinary,
  saveAvatarLocally,
} = require("../util/uploadAvatarToCloudinary");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { username, emailorphone, password, avatar } = req.body;

    // Validate phone or email
    const isPhone = /^\d{10}$/.test(emailorphone);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailorphone);

    if (!isPhone && !isEmail) {
      return res.status(400).json({
        success: false,
        message: "Invalid input field",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ emailorphone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: isPhone
          ? "Phone number already registered"
          : "Email already registered",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({
      username,
      emailorphone,
      password: hashedPassword,
    });

    // Avatar handling (if provided)
    if (avatar && avatar !== "") {
      try {
        const userId = newUser._id.toString();
        const cloudinaryUrl = await uploadAvatarToCloudinary(avatar, userId);
        const localPath = await saveAvatarLocally(avatar, userId);

        newUser.avatar = { cloudinary: cloudinaryUrl, local: localPath };
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Avatar upload failed. Try again later.",
        });
      }
    } else {
      // If no avatar is provided, leave it as null or an empty object
      newUser.avatar = null;
    }

    // Email verification (if applicable)
    if (isEmail && process.env.USER && process.env.PASS) {
      try {
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");
        await sendVerificationEmail(
          newUser.emailorphone,
          newUser.verificationToken,
          username
        );

        await newUser.save();
        return res.status(200).json({
          success: true,
          message: "Email registered successfully. Please verify your email.",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "User registered, but email verification failed.",
        });
      }
    }

    // Save user to database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the user.",
    });
  }
};

// login

const secretKey =
  process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

const loginUser = async (req, res) => {
  try {
    const { emailorphone, password } = req.body;

    // Determine if the input is a phone number or email
    const isPhone = /^\d{10}$/.test(emailorphone);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailorphone);

    if (!isPhone && !isEmail) {
      return res.status(400).json({
        message: "Invalid input field",
      });
    }

    // Find the user by email or phone
    const user = await User.findOne({ emailorphone });
    if (!user) {
      return res.status(404).json({
        success: false,
        // message: "Invalid email or phone number",
        message: "User not registered? Please registered first.",
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Check if the user is verified (for email users)
    // if (isEmail && !user.verified) {
    //   return res.status(403).json({
    //     success:false,
    //     message: "Email not verified. Please verify your email to log in.",
    //   });
    // }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        emailorphone: user.emailorphone,
      },
    });
  } catch (error) {
    // console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

const getUsers = async (req, res) => {
  const { userId } = req.params;
  try {
    const users = await User.find({ _id: { $ne: userId } });
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    // console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

module.exports = { registerUser, loginUser, getUsers };
