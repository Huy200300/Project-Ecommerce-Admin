const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: [
        "GENERAL",
        "ADMIN",
        "orderManager",
        "productManager",
        "accountant",
        "deliveryStaff",
      ],
      default: "GENERAL",
    },
    phone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
