const express = require('express');
const router = express.Router();
const {  verifyOtp, requestOtp, resetPassword } = require('../controllers/otpControllers');
const otpLimiter = require('../middleware/rateLimiter');

router.post('/send-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

router.put('/reset-password', resetPassword);


module.exports = router;
