/** @format */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const loacationSchema = new mongoose.Schema(
  {
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", loacationSchema);
