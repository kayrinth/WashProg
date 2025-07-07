const express = require("express");
const userRoutes = express.Router();
const { userController } = require("../controller");
const { verifyToken } = require("../middleware");
// const { upload } = require("../middleware/upload");

userRoutes.post("/user/register", userController.register);
userRoutes.post("/user/login", userController.login);
userRoutes.post("/admin/login", userController.loginAdmin);
userRoutes.get("/user/dashboard", verifyToken, userController.dashboard);
userRoutes.get("/user/google/login", userController.loginWithGoogle);
userRoutes.get("/user/google/callback", userController.googleCallback);
userRoutes.get("/users", userController.getAll);
userRoutes.get("/user/profile/:id", verifyToken, userController.getProfile);
userRoutes.put("/user/profile/:id", verifyToken, userController.updateProfile);

module.exports = userRoutes;
