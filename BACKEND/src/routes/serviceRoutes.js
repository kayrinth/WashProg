const express = require("express");
const serviceRoutes = express.Router();
const { verifyToken } = require("../middleware");
const { serviceController } = require("../controller");

serviceRoutes.post("/service/create", serviceController.create);
serviceRoutes.get("/services", verifyToken, serviceController.getAll);
serviceRoutes.get(
  "/service/category/:category",
  serviceController.getByCategory
);
serviceRoutes.put("/service/update/:id", serviceController.update);
serviceRoutes.get("/service/:id", serviceController.delete);

module.exports = serviceRoutes;
