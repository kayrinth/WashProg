const express = require("express");
const route = express.Router();
const usersRoutes = require("./userRoutes");
const { model } = require("mongoose");
const serviceRoutes = require("./serviceRoutes");
const categoryRoutes = require("./categoryRoutes");
const orderRoutes = require("./orderRoutes");
const geoRoutes = require("./geoRoutes");
const otpRoutes = require("./otpRoutes");

route.use(usersRoutes);
route.use(serviceRoutes);
route.use(categoryRoutes);
route.use(orderRoutes);
route.use(geoRoutes);
route.use(otpRoutes);

module.exports = route;
