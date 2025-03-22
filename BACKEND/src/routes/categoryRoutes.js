const express = require("express");
const categoryRoutes = express.Router();
const { verifyToken } = require("../middleware");
const { categoryController } = require("../controller");

categoryRoutes.post("/category/create", categoryController.create);
categoryRoutes.get("/categories", categoryController.getAll);
categoryRoutes.get("/category/:id", categoryController.getById);
categoryRoutes.put("/category/update/:id", categoryController.update);
categoryRoutes.delete("/category/delete/:id", categoryController.delete);

module.exports = categoryRoutes;
