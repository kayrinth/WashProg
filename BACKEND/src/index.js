const express = require("express");
const connectDB = require("./config/connect");
const { port } = require("./config/env");
const route = require("./routes");

const app = express();

connectDB();

app.use(express.json());

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
