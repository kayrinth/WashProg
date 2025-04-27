const fs = require("fs");
const ResponseAPI = require("../utils/response");
const { Service } = require("../models");
const { errorMsg, errorName } = require("../utils/errorMiddlewareMsg");
require("dotenv").config();

const serviceController = {
  async create(req, res, next) {
    try {
      const { categoryId, title, description, price } = req.body;

      const findTitle = await Service.findOne({
        title: { $regex: new RegExp(`^${title}$`, "i") },
      });

      if (findTitle) {
        return next({
          name: errorName.CONFLICT,
          message: errorMsg.TITLE_ALREADY_EXISTS,
        });
      }

      const service = await Service.create({
        categoryId,
        title,
        description,
        price,
      });
      ResponseAPI.success(res, service);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const services = await Service.find()
        .populate("categoryId", "title")
        .sort({
          createdAt: -1,
        });
      ResponseAPI.success(res, services);
    } catch (error) {
      next(error);
    }
  },

  async getByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;

      const services = await Service.find({ categoryId: categoryId })
        .populate("categoryId", "title")
        .sort({ createdAt: -1 });

      ResponseAPI.success(res, services);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { category, title, description, price } = req.body;

      const findTitle = await Service.findOne({
        title: { $regex: new RegExp(`^${title}$`, "i") },
      });

      const service = await Service.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      ResponseAPI.success(res, service);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const service = await Service.findByIdAndDelete(id);
      if (!service) {
        return next({
          name: errorName.NOT_FOUND,
          message: errorMsg.SERVICE_NOT_FOUND,
        });
      }
      ResponseAPI.success(res, service);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = serviceController;
