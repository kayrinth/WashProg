const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  services: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  subTotal: { type: Number, required: true },
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = OrderItem;
