const crypto = require("crypto");

class OTPGenerator {
  static generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  static generateOTPWithExpiry() {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    return {
      otp,
      expiresAt,
    };
  }
  // Verify OTP
  static verifyOTP(inputOTP, storedOTP, expiresAt) {
    const now = new Date();

    if (now > expiresAt) {
      return { valid: false, reason: "OTP expired" };
    }

    if (inputOTP !== storedOTP) {
      return { valid: false, reason: "Invalid OTP" };
    }

    return { valid: true };
  }
}

module.exports = OTPGenerator;
