/** @format */

const PropertyType = require("../models/property_type");

exports.create = (req, res) => {
  const propertyType = new PropertyType(req.body);
  propertyType.save((err, data) => {
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
  PropertyType.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  let propertyType = req.propertyType;
  propertyType.remove((err, deletedCategory) => {
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
  const propertyType = req.propertyType;
  propertyType.name = req.body.name;
  propertyType.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.list = (req, res) => {
  PropertyType.find().exec((err, find) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(find);
  });
};
