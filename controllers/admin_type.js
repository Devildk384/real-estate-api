/** @format */

const AdminType = require("../models/admin_type");
var slugify = require("slugify");

exports.create = (req, res) => {
  const adminType = new AdminType(req.body);
  adminType.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error,
      });
    }
    res.json({ data });
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  AdminType.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  let adminType = req.adminType;
  adminType.remove((err, deletedCategory) => {
    if (err) {
      return res.status(400).json({
        error,
      });
    }

    res.json({
      deletedCategory,
      message: "Category deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  const adminType = req.adminType;
  adminType.name = req.body.name;
  adminType.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.list = (req, res) => {
  AdminType.find().exec((err, find) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(find);
  });
};
