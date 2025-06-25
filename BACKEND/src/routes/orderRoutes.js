const express = require("express");
const orderRoutes = express.Router();
const { verifyToken } = require("../middleware");
const { orderController } = require("../controller");

orderRoutes.post("/order", verifyToken, orderController.create);
orderRoutes.get("/orders", verifyToken, orderController.getAll);
orderRoutes.get("/orders/user/", verifyToken, orderController.getByUser);
orderRoutes.delete("/order/delete/:id", verifyToken, orderController.delete);

module.exports = orderRoutes;
