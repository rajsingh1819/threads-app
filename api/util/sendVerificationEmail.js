const nodemailer = require("nodemailer");
const User = require("../models/User")
const sendVerificationEmail = async (email, verificationToken, username) => {
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
      text: `Hi ${username || "there"},
      
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

  
  module.exports = {sendVerificationEmail,verifyUserToken}