/** @format */

const mongoose = require("mongoose");

const adminTypeSchema = new mongoose.Schema(
  {
    adminType: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminType", adminTypeSchema);
