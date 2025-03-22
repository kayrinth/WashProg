const fs = require("fs");
const ResponseAPI = require("../utils/response");
const { Category } = require("../models");
const { errorMsg, errortitle } = require("../utils/errorMiddlewareMsg");
require("dotenv").config();

const categoryController = {
  async create(req, res, next) {
    try {
      const { title } = req.body;

      const findTitle = await Category.findOne({
        title: { $regex: new RegExp(`^${title}$`, "i") },
      });

      if (findTitle) {
        return next({
          name: errorName.CONFLICT,
          message: errorMsg.TITLE_ALREADY_EXISTS,
        });
      }

      const newCategory = await Category.create({
        title,
      });

      ResponseAPI.success(res, newCategory);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      ResponseAPI.success(res, categories);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      ResponseAPI.success(res, category);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title } = req.body;

      const findTitle = await Category.findOne({
        title: { $regex: new RegExp(`^${title}$`, "i") },
      });

      if (findTitle) {
        return next({
          name: errorName.CONFLICT,
          message: errorMsg.TITLE_ALREADY_EXISTS,
        });
      }

      const category = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      ResponseAPI.success(res, category);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findByIdAndDelete(id);
      ResponseAPI.success(res, category);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
