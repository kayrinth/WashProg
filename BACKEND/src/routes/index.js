const express = require("express");
const route = express.Router();
const usersRoutes = require("./userRoutes");
const { model } = require("mongoose");

route.use(usersRoutes);

module.exports = route;
