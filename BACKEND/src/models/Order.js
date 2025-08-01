const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    itemsId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
    status: {
      type: String, 
      enum: ["menunggu", "diproses", "selesai", "diantar", "dibatalkan"],
      default: "menunggu",
    },
    totalPrice: {
      type: Number,
      require: true,
    },
    dateOrder: {
      type: Date,
      default: Date.now(),
    },
    address: {
      type: String,
      // required: true,
    },
    lat: {
      type: Number,
      //required: true,
    },
    lng: {
      type: Number,
      //required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["belum lunas", "lunas"],
      default: "belum lunas",
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
