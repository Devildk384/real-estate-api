/** @format */

const Blog = require("../models/blog");
const formidable = require("formidable");
var slugify = require("slugify");
const fs = require("fs");
const _ = require("lodash");
const { json } = require("body-parser");
const { smartTrim } = require("../helpers/blog");

exports.blogyById = (req, res, next, id) => {
  Blog.findById(id).exec((err, blog) => {
    if (err) {
      return res.status(400).json({
        error: "blog not found",
      });
    }
    req.blog = blog;
    next();
  });
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.multiples = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not upload",
      });
    }

    const { title, body, categories, blog_by } = fields;

    console.log(fields);

    if (!title) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.blog_by = blog_by;
    blog.excerpt = smartTrim(blog.body, 320, " ", " ...");
    blog.slug = slugify(title).toLowerCase();
    let arrayOfCategories = categories && categories.split(",");

    if (files.photo) {
      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }

    blog.save((err, result) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }
      Blog.findByIdAndUpdate(
        result._id,
        {
          $push: { categories: arrayOfCategories },
        },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            err,
          });
        }
        res.json(result);
      });
    });
  });
};

exports.bloglist = (req, res) => {
  Blog.find({}).exec((err, data) => {
    if (err) {
      return res.json({
        error,
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOneAndRemove({ id }).exec((err, data) => {
    if (err) {
      return res.json({
        error,
      });
    }
    res.json({
      message: "Blog deleted successfully",
    });
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    .select("photo")
    .exec((err, blog) => {
      if (err || !blog) {
        return res.status(400).json({
          err,
        });
      }
      res.set("Content-Type", blog.photo.contentType);
      return res.send(blog.photo.data);
    });
};

exports.listRelated = (req, res) => {
  let limit = req.body.limit ? paraeInt(req.body.limit) : 3;
  const { _id, categories } = req.body.blog;

  Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate("postedBy", "_id name username profile")
    .select("title slug excerpt postedBy createdAt updatedAt")
    .exec((err, stories) => {
      if (err) {
        return res.status(400).json({
          error: "Stories not found",
        });
      }
      res.json(stories);
    });
};
