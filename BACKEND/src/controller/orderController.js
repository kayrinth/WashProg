const fs = require("fs");
const ResponseAPI = require("../utils/response");
const { Order, OrderItem, Service } = require("../models");
const { errorMsg, errorName } = require("../utils/errorMiddlewareMsg");
const { gdeetAll } = require("./userController");
const WablastService = require("../config/wablast");
require("dotenv").config();

const orderController = {
  async create(req, res, next) {
    try {
      const { services, userId, address, lat, lng } = req.body;

      let totalPrice = 0;
      let orderItems = [];

      const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(angka);

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
        review: null,
        method: "online",
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
        .populate("userId", "name phoneNumber")
        .populate({
          path: "itemsId",
          populate: {
            path: "services",
            select: "title price",
          },
        });

      // console.log(populatedOrder);
      console.log(populatedOrder.userId.phoneNumber);
      populatedOrder.itemsId.forEach((item) => {
        console.log("Service:", item.services?.title);
        console.log("Items:", item.items);
      });

      await ResponseAPI.success(res, populatedOrder);
      await WablastService.sendMessage(
        populatedOrder.userId.name,
        populatedOrder.itemsId
          .map(
            (item, no) =>
              `${no + 1}. ${item.items} (${item.services.title}) x ${
                item.quantity
              } = Rp ${formatRupiah(item.subTotal)}`
          )
          .join("\n"),
        populatedOrder.address,
        totalPrice,
        populatedOrder.dateOrder,
        populatedOrder.userId.phoneNumber
      );
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

      let order = new Order({ method: "offline", ...req.body });

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

  async getDashboard(req, res, next) {
    try {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);

      const waitingOrders = await Order.countDocuments({ status: "menunggu" });

      const dailyRevenue = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfToday, $lte: endOfToday },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]);

      const totalOrders = await Order.countDocuments();
      const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]);
      const revenueLast7Days = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            total: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(sevenDaysAgo);
        d.setDate(sevenDaysAgo.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        const found = revenueLast7Days.find((r) => r._id === key);
        return {
          date: d.toLocaleDateString("id-ID", {
            weekday: "short",
          }),
          amount: found ? found.total : 0,
        };
      });

      const ordersData = await Order.find({ status: "menunggu" })
        .populate({ path: "userId", select: "name" })
        .populate({
          path: "itemsId",
          populate: { path: "services", select: "title" },
        })
        .limit(3)
        .lean();

      ResponseAPI.success(res, {
        totalOrders,
        waitingOrders,
        dailyRevenue: dailyRevenue.length > 0 ? dailyRevenue[0].total : 0,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        revenueData: days,
        ordersData,
      });
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
      )
        .populate("userId", "name phoneNumber")
        .populate({
          path: "itemsId",
          populate: {
            path: "services",
            select: "title price",
          },
        });

      if (status === "diantar") {
        const totalPrice = updatedOrder.itemsId.reduce(
          (sum, item) => sum + item.subTotal,
          0
        );

        const servicesText = updatedOrder.itemsId
          .map(
            (item, index) =>
              `${index + 1}. ${item.items} (${item.services?.title ?? "-"}) x ${
                item.quantity
              } = Rp ${item.subTotal.toLocaleString("id-ID")}`
          )
          .join("\n");

        try {
          await WablastService.sendMessageDone(
            updatedOrder.userId.name,
            servicesText,
            updatedOrder.address,
            totalPrice,
            updatedOrder.dateOrder,
            updatedOrder.userId.phoneNumber
          );
        } catch (waError) {
          console.error("WA gagal dikirim:", waError.message);
        }
      }

      ResponseAPI.success(res, updatedOrder);
    } catch (error) {
      next(error);
    }
  },

  async updateStatusPayment(req, res, next) {
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

  async updateReview(req, res, next) {
    try {
      const { id } = req.params;
      const { review } = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { review },
        { new: true }
      );

      console.log(req.body);
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

  async getTestimonials(req, res) {
    try {
      const testimonials = await Order.find({ review: { $ne: null } })
        .populate("userId", "name")
        .sort({ createdAt: -1 })
        .limit(6)
        .select("review userId");

      res.json({
        success: true,
        data: testimonials,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
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
