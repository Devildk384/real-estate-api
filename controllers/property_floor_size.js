/** @format */

const PropertyFloorSize = require("../models/property_floor_size");

exports.create = (req, res) => {
  const propertyFloorSize = new PropertyFloorSize(req.body);
  propertyFloorSize.save((err, data) => {
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
  PropertyFloorSize.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  let propertyFloorSize = req.propertyFloorSize;
  propertyFloorSize.remove((err, deletedCategory) => {
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
  const propertyFloorSize = req.propertyFloorSize;
  propertyFloorSize.name = req.body.name;
  propertyFloorSize.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.list = (req, res) => {
  PropertyFloorSize.find().exec((err, find) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(find);
  });
};
