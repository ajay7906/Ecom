const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../utils/sendOtpMail');
const { generateOtp } = require('../utils/otpGenerator');
const bcrypt = require('bcrypt');
const OTP = require('../modal/otp');
const User = require('../modal/user')

// exports.sendOtp = async (req, res) => {
//     const { email } = req.body;
//     try {
//         const otp = generateOtp();
//         await sendOtpEmail(email, otp);
        
//         const token = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: '10m' });
//         res.json({ msg: 'OTP sent', token });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };



exports.requestOtp = async (req, res) => {
    const { email } = req.body;  // Email provided by the user in the request body
    try {
      const user = await User.findOne({ email });  // Find user by email
      if (!user) {
        return res.status(404).json({ message: 'User not found' });  // User does not exist
      }
  
      // Generate a random OTP
      console.log('otp');
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the OTP with an association to the user in the database
      const otpRecord = new OTP({
        userId: user._id,
        otp,
      });
     
      await otpRecord.save();
     console.log('save otp', otpRecord);
     
      // Send OTP to the user's email
      sendOtpEmail(email, otp);
  console.log('not');
  
      res.status(200).json({ message: 'OTP sent successfully to your email' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  
}
// exports.verifyOtp = async (req, res) => {
//     const { token, otp } = req.body;
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if (decoded.otp === otp) {
//             res.json({ msg: 'OTP verified' });
//         } else {
//             res.status(400).json({ msg: 'Invalid OTP' });
//         }
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the OTP record for the user
        console.log(user._id, otp);
        
        const otpRecord = await OTP.findOne({ userId: user._id, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is valid, remove OTP record after verification
        await OTP.deleteOne({ userId: user._id, otp });

        // Generate a token to reset password
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '6h' });
        res.json({ msg: 'OTP verified', token });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Server Error');
    }
};




// // Reset Password Controller
// exports.resetPassword = async (req, res) => {
//     const { token, newPassword } = req.body;
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Find the user by email
//         const user = await User.findOne({ email: decoded.email });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Hash the new password
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(newPassword, salt);

//         await user.save();

//         res.status(200).json({ message: 'Password has been reset successfully' });
//     } catch (error) {
//         console.error('Error resetting password:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };






// // Reset Password Controller
// exports.resetPassword = async (req, res) => {
//     const { token, newPassword } = req.body;  // Destructure the token and newPassword from the request body
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token using the JWT_SECRET

//         // Find the user by email
//         const user = await User.findOne({ email: decoded.email });
//         console.log(user);
        
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Hash the new password
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(newPassword, salt);

//         await user.save();  // Save the updated user object to the database
//         console.log('successs');
        
//         res.status(200).json({ message: 'Password has been reset successfully' });
//     } catch (error) {
//         console.error('Error resetting password:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };





// authController.js
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;  // Receive email and newPassword from request body
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
  
      await user.save();  // Save the updated user object to the database
  
      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  