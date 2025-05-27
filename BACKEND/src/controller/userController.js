const fs = require("fs");
const ResponseAPI = require("../utils/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const env = require("../config/env");
const { errorMsg, errorName } = require("../utils/errorMiddlewareMsg");
require("dotenv").config();
const oauth2Client = require("../config/googleAuth");
const { google } = require("googleapis");

const userController = {
  // **Register User**
  async register(req, res, next) {
    try {
      const { name, email, phoneNumber, password } = req.body;

      const findUser = await User.findOne({ email });

      if (findUser) {
        return next({
          name: errorName.CONFLICT,
          message: errorMsg.USER_ALREADY_EXISTS,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        joinAt: new Date(),
      });

      ResponseAPI.success(res, {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
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
      const { email, password } = req.body;

      // Validasi input
      if (!email || !password) {
        return next({
          name: errorName.BAD_REQUEST,
          message: "Email dan password harus diisi",
        });
      }

      const user = await User.findOne({ email });
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

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
      );

      // Kirim response dengan token dan data user
      return ResponseAPI.success(res, {
        token,
        userId: user._id,
        user: {
          name: user.name,
          email: user.email,
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
      const { email, password } = req.body;

      const user = await User.findOne({ email });
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
        { id: user._id, email: user.email },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
      );

      return ResponseAPI.success(res, { token });
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
        // Create new user if doesn't exist
        user = await User.create({
          name: data.name,
          email: data.email,
          googleId: data.id,
          authType: "google",
          profilePicture: data.picture || "",
        });
      } else if (user.authType === "local") {
        // Link Google account to existing local account
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

      // Option 1: Redirect to frontend with token in URL
      // res.redirect(`http://localhost:3000/auth/success?token=${token}`);

      // Option 2: Return token as JSON
      res.json({
        message: "Google login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      next(error);
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
      const user = await User.find(req.user).select("-password");

      ResponseAPI.success(res, user);
    } catch (error) {
      next(error);
    }
  },

  // Update User
  async updateProfile(req, res, next) {
    const userId = req.params.id;
    try {
      const { name, email, phoneNumber, password } = req.body;
      const findUser = await User.findById(userId);

      if (req.body.password) findUser.password = password;
      if (name) findUser.name = name;
      if (email) findUser.email = email;
      if (phoneNumber) findUser.phoneNumber = phoneNumber;
      await findUser.save();
      ResponseAPI.success(res, findUser);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
