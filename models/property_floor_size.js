/** @format */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const propertyFloorSizeSchema = new mongoose.Schema(
  {
    property_floor_size: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PropertyFloorSize", propertyFloorSizeSchema);
