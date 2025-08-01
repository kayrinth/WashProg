const fs = require("fs");
const ResponseAPI = require("../utils/response");
const { Order, OrderItem, Service } = require("../models");
const { errorMsg, errorName } = require("../utils/errorMiddlewareMsg");
const { gdeetAll } = require("./userController");
require("dotenv").config();

const orderController = {
  async create(req, res, next) {
    try {
      const { services, userId, address, lat, lng } = req.body;

      let totalPrice = 0;
      let orderItems = [];

      // Membuat order baru
      let order = new Order({
        userId,
        status: "menunggu",
        paymentStatus: "belum lunas",
        lat,
        lng,
        address,
        dateOrder: new Date(),
        totalPrice: 0,
        itemsId: [],
      });

      // Simpan dulu order
      await order.save();

      // Membuat order items dan menghitung total price
      for (let service of services) {
        const foundService = await Service.findById(service.serviceId);

        // Menghitung subTotal untuk masing-masing layanan
        const subTotal = foundService.price * service.quantity;
        totalPrice += subTotal;

        // Membuat OrderItem
        const orderItem = new OrderItem({
          orderId: order._id,
          services: service.serviceId,
          address,
          quantity: service.quantity,
          subTotal,
          items: service.items,
        });

        // Simpan OrderItem
        await orderItem.save();

        // Masukkan order item ke dalam array orderItems
        orderItems.push(orderItem._id);
      }

      // Update order dengan order items dan totalPrice yang baru
      order.itemsId = orderItems;
      order.totalPrice = totalPrice;
      await order.save();

      const populatedOrder = await Order.findById(order._id)
        .populate("userId", "name")
        .populate({
          path: "itemsId",
          populate: {
            path: "services",
            select: "title price",
          },
        });

      ResponseAPI.success(res, populatedOrder);
    } catch (error) {
      console.error("Error dalam create order:", error);
      next(error);
    }
  },

  async createAdmin(req, res, next) {
    try {
      const { services, name, phoneNumber } = req.body;

      let totalPrice = 0;
      let orderItems = [];

      const formattedPhone = phoneNumber.startsWith("+62")
        ? phoneNumber
        : `+62${
            phoneNumber.startsWith("0") ? phoneNumber.substring(1) : phoneNumber
          }`;

      let order = new Order(req.body);

      // Simpan dulu order
      await order.save();

      // Membuat order items dan menghitung total price
      for (let service of services) {
        const foundService = await Service.findById(service.serviceId);

        // Menghitung subTotal untuk masing-masing layanan
        const subTotal = foundService.price * service.quantity;
        totalPrice += subTotal;

        // Membuat OrderItem
        const orderItem = new OrderItem({
          name,
          phoneNumber: formattedPhone,
          orderId: order._id,
          services: service.serviceId,
          quantity: service.quantity,
          subTotal,
          items: service.items,
        });

        // Simpan OrderItem
        await orderItem.save();

        // Masukkan order item ke dalam array orderItems
        orderItems.push(orderItem._id);
      }

      // Update order dengan order items dan totalPrice yang baru
      order.itemsId = orderItems;
      order.totalPrice = totalPrice;
      await order.save();

      const populatedOrder = await Order.findById(order._id).populate({
        path: "itemsId",
        populate: {
          path: "services",
          select: "title price",
        },
      });

      ResponseAPI.success(res, populatedOrder);
    } catch (error) {
      console.error("Error dalam create order:", error);
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const orders = await Order.find({ userId: { $ne: null } })
        .populate("userId", "name")
        .populate({
          path: "itemsId",
          populate: {
            path: "services",
            select: "title",
          },
        });
      ResponseAPI.success(res, orders);
    } catch (error) {
      next(error);
    }
  },

  async getAdmin(req, res, next) {
    try {
      const orders = await Order.find({ userId: null }).populate({
        path: "itemsId",
        populate: {
          path: "services",
          select: "title",
        },
      });
      ResponseAPI.success(res, orders);
    } catch (error) {
      next(error);
    }
  },

  async getByUser(req, res, next) {
    try {
      const userId = req.user._id;

      const findOrdersByUser = await Order.find({ userId: userId })
        .sort({ createdAt: -1 })
        .populate("userId", "name")
        .populate({
          path: "itemsId",
          populate: {
            path: "services",
            select: "title",
          },
        });

      if (findOrdersByUser.length === 0) {
        return next({
          name: errorName.NOT_FOUND,
          message: errorMsg.ORDER_NOT_FOUND,
        });
      }

      ResponseAPI.success(res, findOrdersByUser);
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return next({
          name: "NOT_FOUND",
          message: "Order tidak ditemukan",
        });
      }

      ResponseAPI.success(res, updatedOrder);
    } catch (error) {
      next(error);
    }
  },

  async updateStatusPembayaran(req, res, next) {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { paymentStatus },
        { new: true }
      );

      if (!updatedOrder) {
        return next({
          name: "NOT_FOUND",
          message: "Order tidak ditemukan",
        });
      }

      ResponseAPI.success(res, updatedOrder);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const userId = req.user._id;
      const { id } = req.params;

      const order = await Order.findById(id);

      if (order.userId.toString() !== userId.toString()) {
        return next({
          name: errorName.UNAUTHORIZED,
          message: "Anda tidak berhak menghapus pesanan ini",
        });
      }

      const { status } = order;

      if (
        status !== "diambil" &&
        status !== "diproses" &&
        status !== "selesai"
      ) {
        const deletedOrder = await Order.findByIdAndDelete(id);
        return ResponseAPI.success(res, deletedOrder);
      }

      return next({
        name: errorName.BAD_REQUEST,
        message:
          "Pesanan tidak bisa dihapus karena sedang diproses atau telah selesai",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
