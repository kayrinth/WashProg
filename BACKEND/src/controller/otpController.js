const OTPModel = require("../models/OTP");
const OTPGenerator = require("../utils/otpGenerator");
const WablastService = require("../config/wablast");
const ResponseAPI = require("../utils/response");
const { errorMsg, errorName } = require("../utils/errorMiddlewareMsg");

const otpController = {
  // Send OTP for registration
  async sendOTP(req, res, next) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return next({
          name: errorName.BAD_REQUEST,
          message: "Nomor WhatsApp harus diisi",
        });
      }

      const formattedPhone = phoneNumber.startsWith("+62")
        ? phoneNumber
        : phoneNumber.startsWith("0")
        ? "+62" + phoneNumber.slice(1)
        : "+62" + phoneNumber;

      // Check if OTP already exists and not expired
      const existingOTP = await OTPModel.findOne({
        phoneNumber: formattedPhone,
        expiresAt: { $gt: new Date() },
      });

      if (existingOTP) {
        return next({
          name: errorName.TOO_MANY_REQUESTS,
          message:
            "OTP sudah dikirim. Silakan tunggu 5 menit untuk mengirim ulang.",
        });
      }

      // Generate new OTP
      const { otp, expiresAt } = OTPGenerator.generateOTPWithExpiry();

      // Delete existing OTP for this phone number
      await OTPModel.deleteOne({ phoneNumber: formattedPhone });

      // Save new OTP
      await OTPModel.create({
        phoneNumber: formattedPhone,
        otp,
        expiresAt,
      });

      // Send OTP via Wablast
      await WablastService.sendOTP(formattedPhone, otp);

      ResponseAPI.success(res, {
        message: "OTP berhasil dikirim ke WhatsApp Anda",
        phoneNumber: formattedPhone,
        expiresIn: "5 menit",
      });
    } catch (error) {
      console.error("Send OTP Error:", error);
      next(error);
    }
  },

  // Verify OTP
  async verifyOTP(req, res, next) {
    try {
      const { phoneNumber, otp } = req.body;

      if (!phoneNumber || !otp) {
        return next({
          name: errorName.BAD_REQUEST,
          message: "Nomor WhatsApp dan OTP harus diisi",
        });
      }

      const formattedPhone = phoneNumber.startsWith("+62")
        ? phoneNumber
        : `+62${
            phoneNumber.startsWith("0") ? phoneNumber.substring(1) : phoneNumber
          }`;

      // Find OTP record
      const otpRecord = await OTPModel.findOne({ phoneNumber: formattedPhone });

      if (!otpRecord) {
        return next({
          name: errorName.NOT_FOUND,
          message: "OTP tidak ditemukan. Silakan minta OTP baru.",
        });
      }

      // Check attempts limit
      if (otpRecord.attempts >= 3) {
        await OTPModel.deleteOne({ phoneNumber: formattedPhone });
        return next({
          name: errorName.TOO_MANY_REQUESTS,
          message: "Terlalu banyak percobaan. Silakan minta OTP baru.",
        });
      }

      // Verify OTP
      const verification = OTPGenerator.verifyOTP(
        otp,
        otpRecord.otp,
        otpRecord.expiresAt
      );

      if (!verification.valid) {
        // Increment attempts
        otpRecord.attempts += 1;
        await otpRecord.save();

        return next({
          name: errorName.UNAUTHORIZED,
          message:
            verification.reason === "OTP expired"
              ? "OTP sudah kadaluarsa. Silakan minta OTP baru."
              : `OTP tidak valid. Sisa percobaan: ${3 - otpRecord.attempts}`,
        });
      }

      // Mark as verified
      otpRecord.verified = true;
      await otpRecord.save();

      ResponseAPI.success(res, {
        message: "OTP berhasil diverifikasi",
        phoneNumber: formattedPhone,
        verified: true,
      });
    } catch (error) {
      console.error("Verify OTP Error:", error);
      next(error);
    }
  },

  // Resend OTP
  async resendOTP(req, res, next) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return next({
          name: errorName.BAD_REQUEST,
          message: "Nomor WhatsApp harus diisi",
        });
      }

      const formattedPhone = phoneNumber.startsWith("+62")
        ? phoneNumber
        : phoneNumber.startsWith("0")
        ? "+62" + phoneNumber.slice(1)
        : "+62" + phoneNumber;

      await OTPModel.deleteOne({ phoneNumber: formattedPhone });

      // Generate new OTP
      const { otp, expiresAt } = OTPGenerator.generateOTPWithExpiry();

      // Save new OTP
      await OTPModel.create({
        phoneNumber: formattedPhone,
        otp,
        expiresAt,
      });

      // Send OTP via Wablast
      await WablastService.sendOTP(formattedPhone, otp);

      ResponseAPI.success(res, {
        message: "OTP baru berhasil dikirim ke WhatsApp Anda",
        phoneNumber: formattedPhone,
        expiresIn: "5 menit",
      });
    } catch (error) {
      console.error("Resend OTP Error:", error);
      next(error);
    }
  },
};

module.exports = otpController;
