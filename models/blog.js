/** @format */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    body: {
      type: {},
      trim: true,
    },
    excerpt: {
      type: String,
      max: 1000,
    },

    photo: {
      data: Buffer,
      contentType: String,
    },
    categories: {
      type: ObjectId,
      ref: "Category",
      require: true,
    },
    blog_by: {
      type: ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
