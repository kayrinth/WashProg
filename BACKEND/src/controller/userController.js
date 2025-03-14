const fs = require("fs");
const ResponseAPI = require("../utils/response");
const { User } = require("../models");
const { errorMsg, errorName } = require("../utils/errorMiddlewareMsg");
require("dotenv").config();

const userController = {
  // **Register User**
  async register(req, res, next) {
    try {
      const { name, email, password, phoneNumber } = req.body;

      const findUser = await User.findOne({ email });

      if (findUser) {
        return next({
          name: errorName.CONFLICT,
          message: errorMsg.USER_ALREADY_EXISTS,
        });
      }

      const newUser = await User.create({
        name,
        email,
        password,
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
