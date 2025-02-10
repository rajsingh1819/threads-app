const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Temporary OTP storage (for simplicity)
const otpStore = new Map();

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via email
const sendOTPEmail = async (emailOrPhone, otp) => {
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
    from: process.env.USER,
    to: emailOrPhone, // Treat it as email
    subject: "Password Reset OTP",
    text: `Hi User,
    
    Your OTP for password reset is: ${otp}. It is valid for 10 minutes.
    If you did not request this, please ignore this email.
    
    Best regards,
    The Threads Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${emailOrPhone}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

// Send OTP via phone (for simplicity, just an example)
const sendOTPPhone = async (phone, otp) => {
  // Implement your phone-based OTP sending (e.g., using Twilio or another SMS API)
  console.log(`OTP sent to phone: ${phone}`);
};

// Send OTP based on email or phone format
const sendOTP = (emailOrPhone, otp) => {
  if (emailOrPhone.includes("@")) {
    return sendOTPEmail(emailOrPhone, otp);
  } else {
    return sendOTPPhone(emailOrPhone, otp);
  }
};

// Request OTP (Step 1)
router.post("/request-otp", async (req, res) => {
  const { emailOrPhone } = req.body;

  try {
    const user = await User.findOne({
      emailorphone: { $regex: new RegExp(`^${emailOrPhone}$`, "i") },
    });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    otpStore.set(emailOrPhone, { otp, expiresAt });

    // Send OTP based on the format (email or phone)
    await sendOTP(emailOrPhone, otp);
    res.status(200).json({ success: true, message: "OTP sent to email or phone" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// Verify OTP (Step 2)
router.post("/verify-otp", async (req, res) => {
  const { emailOrPhone, otp } = req.body;

  const storedOTP = otpStore.get(emailOrPhone);

  if (!storedOTP) {
    return res.status(400).json({ success: false, message: "OTP not found" });
  }

  // Check if OTP is expired
  if (Date.now() > storedOTP.expiresAt) {
    otpStore.delete(emailOrPhone);
    return res.status(400).json({ success: false, message: "OTP has expired" });
  }

  // Check if OTP matches
  if (storedOTP.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  res.status(200).json({ success: true, message: "OTP verified" });
});

// Reset Password (Step 3)
router.post("/reset-password", async (req, res) => {
  const { emailOrPhone, otp, newPassword } = req.body;

  const storedOTP = otpStore.get(emailOrPhone);

  if (!storedOTP) {
    return res.status(400).json({ success: false, message: "OTP not found" });
  }

  // Check if OTP is expired
  if (Date.now() > storedOTP.expiresAt) {
    otpStore.delete(emailOrPhone);
    return res.status(400).json({ success: false, message: "OTP has expired" });
  }

  // Check if OTP matches
  if (storedOTP.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  const user = await User.findOne({
    emailorphone: { $regex: new RegExp(`^${emailOrPhone}$`, "i") },
  });

  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  // Hash the new password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  otpStore.delete(emailOrPhone); // Delete OTP after successful password reset

  res.status(200).json({ success: true, message: "Password reset successful" });
});

module.exports = router;
