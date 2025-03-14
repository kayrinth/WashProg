const express = require("express");
const userRoutes = express.Router();
const { userController } = require("../controller");
// const { auth, adminRegistration } = require("../middleware");
// const { upload } = require("../middleware/upload");

userRoutes.post("/user/register", userController.register);
userRoutes.get("/users", userController.getAll);
userRoutes.get("/user/profile/:id", userController.getProfile);
userRoutes.put("/user/profile/:id", userController.updateProfile);

module.exports = userRoutes;
