/** @format */

const mongoose = require("mongoose");

const propertyTypeSchema = new mongoose.Schema(
  {
    property_type: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PropertyType", propertyTypeSchema);
