const express = require("express");
const connectDB = require("./config/connect");
const { port } = require("./config/env");
const oauth2Client = require("./config/googleAuth");
const route = require("./routes");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");

require("dotenv").config();

const app = express();
app.use(express.json());

// Definisikan scopes terlebih dahulu
const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

// Kemudian gunakan dalam generateAuthUrl
const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

connectDB();

// Routing
app.use("/api/v1", route);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      name: err.name || "Error",
      message: message,
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
