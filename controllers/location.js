/** @format */

const Location = require("../models/location");

exports.create = (req, res) => {
  const location = new Location(req.body);
  location.save((err, data) => {
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
  Location.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  let location = req.location;
  location.remove((err, deletedCategory) => {
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
  const location = req.location;
  location.name = req.body.name;
  location.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.list = (req, res) => {
  Location.find().exec((err, find) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(find);
  });
};
