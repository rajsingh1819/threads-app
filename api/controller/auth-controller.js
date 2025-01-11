const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { username, emailorphone, password } = req.body;

    // Validate if input is a phone number or email
    const isPhone = /^\d{10}$/.test(emailorphone); // Regex for 10-digit phone number
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailorphone); // Regex for valid email

    if (!isPhone && !isEmail) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input. Please provide a valid 10-digit phone number or email address.",
      });
    }

    // Check if email or phone number already exists
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

    // Create a new user
    const newUser = new User({
      username,
      emailorphone,
      password: hashedPassword,
    });

    // Check if email verification is possible
    if (isEmail && process.env.USER && process.env.PASS) {
      newUser.verificationToken = crypto.randomBytes(20).toString("hex");
      await newUser.save();

      // Send verification email
      try {
        await sendVerificationEmail(
          newUser.emailorphone,
          newUser.verificationToken
        );
        return res.status(200).json({
          success: true,
          message: "Email registered successfully. Please verify your email.",
        });
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        return res.status(500).json({
          success: false,
          message: "User registered, but email verification could not be sent.",
        });
      }
    }

    // Save user without email verification
    await newUser.save();
    res.status(200).json({
      success: true,
      message: isPhone
        ? "Phone number registered successfully"
        : "Email registered successfully. Email verification skipped.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};

// Send verification email function
const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.USER, // Use configured email
    to: email,
    subject: "Email Verification - Threads",
    text: `Hi there,
    
Thank you for registering on Threads. Please verify your email address by clicking on the link below:
http://localhost:3000/api/auth/user/verify/${verificationToken}

If you did not request this, please ignore this email.

Best regards,
The Threads Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Verify user token function
const verifyUserToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Mark the user as verified and clear the token
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res
      .status(500)
      .json({ success: false, message: "Email verification failed" });
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
        message:
          "Invalid input. Please provide a valid 10-digit phone number or email address.",
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
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};


const getUsers = async (req, res) => {
  const { userId } = req.params;
  try {
    const users = await User.find({ _id: { $ne: userId } });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

module.exports = { registerUser, verifyUserToken, loginUser, getUsers };
