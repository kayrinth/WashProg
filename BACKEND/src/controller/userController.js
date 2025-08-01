const fs = require("fs");
const ResponseAPI = require("../utils/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, OTP } = require("../models");
const env = require("../config/env");
const { errorMsg, errorName } = require("../utils/errorMiddlewareMsg");
require("dotenv").config();
const oauth2Client = require("../config/googleAuth");
const { google } = require("googleapis");

const userController = {
  async register(req, res, next) {
    try {
      const { name, phoneNumber, password } = req.body;

      // Format phone number
      const formattedPhone = phoneNumber.startsWith("+62")
        ? phoneNumber
        : `+62${
            phoneNumber.startsWith("0") ? phoneNumber.substring(1) : phoneNumber
          }`;

      // Check if user already exists
      const findUser = await User.findOne({ phoneNumber: formattedPhone });
      if (findUser) {
        return next({
          name: errorName.CONFLICT,
          message: errorMsg.USER_ALREADY_EXISTS,
        });
      }

      // Verify OTP before registration
      const otpRecord = await OTP.findOne({
        phoneNumber: formattedPhone,
        verified: true,
        expiresAt: { $gt: new Date() },
      });

      if (!otpRecord) {
        return next({
          name: errorName.UNAUTHORIZED,
          message:
            "OTP belum diverifikasi atau sudah kadaluarsa. Silakan verifikasi OTP terlebih dahulu.",
        });
      }

      console.log("Password untuk hashing:", password);

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log("Password berhasil di-hash:", hashedPassword);

      // Create new user
      const newUser = await User.create({
        name,
        password: hashedPassword,
        phoneNumber: formattedPhone,
        joinAt: new Date(),
        isVerified: true,
      });

      // Delete OTP record after successful registration
      await OTP.deleteOne({ phoneNumber: formattedPhone });

      ResponseAPI.success(res, {
        message: "Registrasi berhasil!",
        user: {
          id: newUser._id,
          name: newUser.name,
          phoneNumber: newUser.phoneNumber,
          isVerified: newUser.isVerified,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // **Login User**
  // controllers/authController.js
  async login(req, res, next) {
    try {
      const { phoneNumber, password } = req.body;

      // Validasi input
      if (!phoneNumber || !password) {
        return next({
          name: errorName.BAD_REQUEST,
          message: "nomor Whatsapp dan password harus diisi",
        });
      }

      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return next({
          name: errorName.NOT_FOUND,
          message: errorMsg.USER_NOT_FOUND,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next({
          name: errorName.UNAUTHORIZED,
          message: errorMsg.INVALID_CREDENTIALS,
        });
      }

      const token = jwt.sign(
        { id: user._id, phoneNumber: user.phoneNumber },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
      );

      if (user.role !== "user") {
        return next({
          name: errorName.FORBIDDEN,
          message: "Access denied. user privileges required.",
        });
      }

      // Kirim response dengan token dan data user
      return ResponseAPI.success(res, {
        token,
        userId: user._id,
        user: {
          name: user.name,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      next(error);
    }
  },

  //login admin
  async loginAdmin(req, res, next) {
    try {
      const { phoneNumber, password } = req.body;

      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return next({
          name: errorName.NOT_FOUND,
          message: errorMsg.USER_NOT_FOUND,
        });
      }

      if (user.role !== "admin") {
        return next({
          name: errorName.FORBIDDEN,
          message: "Access denied. Admin privileges required.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next({
          name: errorName.UNAUTHORIZED,
          message: errorMsg.INVALID_CREDENTIALS,
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.phoneNumber },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
      );

      return ResponseAPI.success(res, {
        token,
        userId: user._id,
        user: {
          name: user.name,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async loginWithGoogle(req, res) {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      include_granted_scopes: true,
    });

    res.redirect(authUrl);
  },

  async googleCallback(req, res, next) {
    try {
      const { code } = req.query;

      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Get user info
      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });

      const { data } = await oauth2.userinfo.get();

      // Find or create user
      let user = await User.findOne({ email: data.email });

      if (!user) {
        user = await User.create({
          name: data.name,
          email: data.email,
          googleId: data.id,
          authType: "google",
          profilePicture: data.picture || "",
        });
      } else if (user.authType === "local") {
        user.googleId = data.id;
        user.profilePicture = user.profilePicture || data.picture;
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        env.jwtSecret,
        {
          expiresIn: env.jwtExpiresIn || "1d",
        }
      );

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      };

      // **REDIRECT ke frontend dengan data di URL**
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const redirectUrl = `${frontendUrl}/auth/success?token=${encodeURIComponent(
        token
      )}&user=${encodeURIComponent(JSON.stringify(userData))}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(
        `${frontendUrl}/auth/error?message=${encodeURIComponent("Login gagal")}`
      );
    }
  },

  async dashboard(req, res, next) {
    try {
      return ResponseAPI.success(res, {
        message: `Halo ${req.user.name}, selamat datang di dashboard!`,
      });
    } catch (error) {
      next(error);
    }
  },

  // User Profile
  async getProfile(req, res, next) {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId).select("-password");

      ResponseAPI.success(res, user);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const user = await User.find({ role: { $ne: "admin" } }).select(
        "-password"
      );
      ResponseAPI.success(res, user);
    } catch (error) {
      next(error);
    }
  },

  // Update User
  async updateProfile(req, res, next) {
    const userId = req.params.id;

    try {
      const { name, password } = req.body;
      const findUser = await User.findById(userId);

      if (!findUser) {
        return res.status(404).json({ error: "User tidak ditemukan" });
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        findUser.password = hashedPassword;
      }

      if (name) findUser.name = name;

      await findUser.save();

      ResponseAPI.success(res, findUser);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
