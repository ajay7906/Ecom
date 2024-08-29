// utils/sendOtpEmail.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
// Create a transporter object using your SMTP server details
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your email address
    pass: process.env.EMAIL_PASS,  // Your email password or an app-specific password
  },
});

// Function to send OTP email
const sendOtpEmail = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender address
    to: email,  // Recipient address
    subject: 'Password Reset OTP',  // Subject line
    text: `Your OTP for password reset is: ${otp}`,  // Plain text body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP email:', error);
    } else {
      console.log('OTP email sent:', info.response);
    }
  });
};

module.exports = {sendOtpEmail};
