// routes/otp.js
const express = require("express");
const { otpController } = require("../controller");
const router = express.Router();

router.post("/send", otpController.sendOTP);
router.post("/verify", otpController.verifyOTP);
router.post("/resend", otpController.resendOTP);

module.exports = router;
