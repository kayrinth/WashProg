const { errorMsg, errorName } = require("../utils/errorMiddlewareMsg");
const User = require("../models/User");
const mongoose = require("mongoose");

const checkUser = async (req, res, next) => {
  try {
    // Pastikan _id ada di request body
    if (!req.body._id) {
      return next({
        name: errorName.BAD_REQUEST,
        message: "User ID is required",
      });
    }

    // Validasi apakah _id valid sebagai ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
      return next({
        name: errorName.BAD_REQUEST,
        message: "Invalid User ID format",
      });
    }

    // Cek Apakah User Ada dan Belum Dihapus
    const user = await User.findById(req.body._id);

    // Jika User Tidak Ada atau sudah dihapus
    if (!user || user.deleteAt !== null) {
      return next({
        name: errorName.NOT_FOUND,
        message: errorMsg.USER_NOT_FOUND,
      });
    }

    // Jika User Ada Maka Lanjut ke Middleware Berikutnya
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkUser;
