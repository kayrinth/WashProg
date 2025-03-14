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
    email: {
      type: String,
      required: [true, "Email Wajib Diisi"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Mohon Masukkan Email Yang Valid",
      ],
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password Wajib Diisi"],
      minlength: [6, "Password Wajib Minimal 6 Karakter"],
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const phoneRegex = /^(?:\+62|62|0)8[1-9]\d{8,9}$/;
userSchema.pre("save", async function (next) {
  if (this.phoneNumber) {
    this.phoneNumber = this.phoneNumber.replace(/\s+/g, "");
    if (this.phoneNumber.startsWith("0")) {
      this.phoneNumber = "+62" + this.phoneNumber.substring(1);
    }
    if (!phoneRegex.test(this.phoneNumber)) {
      return next(new Error("Nomor telepon tidak valid"));
    }
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
