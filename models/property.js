/** @format */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const propertySchema = new mongoose.Schema(
  {
    project_by: {
      type: ObjectId,
      ref: "Admin",
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: Array,
      default: [],
    },
    propertyFor: {
      type: String,
      trim: true,
    },

    type: {
      type: ObjectId,
      ref: "PropertyType",
    },
    status: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: ObjectId,
      ref: "Location",
    },
    neighborhood: {
      type: String,
      trim: true,
    },
    pincode: {
      type: Number,
      default: 0,
    },
    country: {
      type: String,
      trim: true,
    },
    map_lat: {
      type: Number,
      default: 0,
    },
    map_long: {
      type: Number,
      default: 0,
    },

    rera_number: {
      type: String,
      trim: true,
    },
    project_area: {
      type: String,
    },
    project_size: {
      type: String,
    },
    project_date: {
      type: String,
    },
    project_videoURL: {
      type: String,
      trim: true,
    },
    project_video360URL: {
      type: String,
      trim: true,
    },
    project_group: {
      type: String,
      trim: true,
    },
    project_amenities: [
      {
        type: ObjectId,
        ref: "PropertyAmenity",
      },
    ],

    floor_plan: [
      {
        floor_plan_desc: {
          type: String,
          trim: true,
        },
        floor_plan_Bedroom: {
          type: String,
          trim: true,
        },
        floor_plan_Bathroom: {
          type: String,
          trim: true,
        },
        floor_plan_size: {
          type: String,
          trim: true,
        },
        floor_plan_area: {
          type: Number,
          default: 0,
        },
        floor_plan_price: {
          type: Number,
          default: 0,
        },
        floor_plan_image: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
