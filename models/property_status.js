/** @format */

const mongoose = require("mongoose");

const propertyStatusSchema = new mongoose.Schema(
  {
    property_status: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PropertyStatus", propertyStatusSchema);
