const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: {
      type: String,
      required: [true, "Nama Wajib Diisi"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: "",
      unique: true,
    },
    // phoneNumber: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "OTP",
    //   required: [true, "Nomor Telepon Wajib Diisi"],
    // },
    googleId: {
      type: String,
      sparse: true,
    },
    authType: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const phoneRegex = /^(?:\+62|62|0)8[1-9]\d{8,9}$/;
userSchema.pre("save", async function (next) {
  if (this.phoneNumber) {
    this.phoneNumber = this.phoneNumber.replace(/\s+/g, "");
    if (!phoneRegex.test(this.phoneNumber)) {
      return next(new Error("Nomor telepon tidak valid"));
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;

// email: {
//   type: String,
//   required: [true, "Email Wajib Diisi"],
//   unique: true,
//   trim: true,
//   lowercase: true,
//   match: [
//     /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//     "Mohon Masukkan Email Yang Valid",
//   ],
// },
