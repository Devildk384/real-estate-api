/** @format */

const Property = require("../models/property");
const Blog = require("../models/blog");

exports.propertyList = (req, res) => {
  Property.find().exec((err, find) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(find);
  });
};

exports.blogList = (req, res) => {
  Blog.find().exec((err, find) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(find);
  });
};

exports.ApproveBloglist = (req, res) => {
  Blog.find({ approvedbyAdmin: true }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.ApprovePropertylist = (req, res) => {
  Property.find({ approvedbyAdmin: true }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.approveProperty = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Property.findOne({ slug }).exec((err, property) => {
    console.log(property);
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    property.approvedbyAdmin = req.body.approvedbyAdmin;
    property.save((err, result) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }

      res.json(result);
    });
  });
};

exports.approveBlog = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }).exec((err, blog) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    blog.approvedbyAdmin = req.body.approvedbyAdmin;
    blog.save((err, result) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }

      res.json(result);
    });
  });
};

exports.blogRemove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOneAndRemove({ slug }).exec((err, approvedelete) => {
    if (err || !approvedelete) {
      return res.status(400).json({
        err,
      });
    }
    res.json({
      message: "Blog delete successfully",
    });
  });
};

exports.propertyremove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Property.findOneAndRemove({ slug }).exec((err, approvedelete) => {
    if (err || !approvedelete) {
      return res.status(400).json({
        err,
      });
    }
    res.json({
      message: "Property delete successfully",
    });
  });
};
