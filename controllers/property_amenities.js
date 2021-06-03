/** @format */

const PropertyAmenity = require("../models/property_amenities");

exports.create = (req, res) => {
  const amenity = new PropertyAmenity(req.body);
  amenity.save((err, data) => {
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
  PropertyAmenity.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  let amenity = req.amenity;
  amenity.remove((err, deletedCategory) => {
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
  const amenity = req.amenity;
  amenity.name = req.body.name;
  amenity.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.list = (req, res) => {
  PropertyAmenity.find().exec((err, find) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(find);
  });
};
