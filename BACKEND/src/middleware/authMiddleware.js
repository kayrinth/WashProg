const jwt = require("jsonwebtoken");
const env = require("../config/env");
const response = require("../utils/response");
const { User } = require("../models/");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    // Cek apakah token ada
    if (!token) {
      return response.error(
        res,
        { message: "Akses ditolak, token tidak ditemukan" },
        401
      );
    }

    jwt.verify(token, env.jwtSecret, async (err, decoded) => {
      if (err) {
        return response.error(
          res,
          { message: "Token tidak valid atau kadaluarsa" },
          403
        );
      }

      // Ambil data user dari database
      const user = await User.findById(decoded.id).select("-password");

      // Cek apakah user masih ada
      if (!user) {
        return response.error(res, { message: "User tidak ditemukan" }, 404);
      }

      // Simpan data user ke req
      req.user = user;

      // Lanjutkan ke middleware berikutnya
      next();
    });
  } catch (error) {
    return response.error(
      res,
      { message: "Terjadi kesalahan saat verifikasi token" },
      500
    );
  }
};

module.exports = verifyToken;
