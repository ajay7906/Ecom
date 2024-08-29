const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 OTP requests per windowMs
    message: 'Too many OTP requests, please try again later.',
});

module.exports = otpLimiter;
