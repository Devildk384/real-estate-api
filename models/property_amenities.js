/** @format */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const propertyAmenitySchema = new mongoose.Schema(
  {
    amenity: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PropertyAmenity", propertyAmenitySchema);
