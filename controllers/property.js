/** @format */

const Property = require("../models/property");
const formidable = require("formidable");
var slugify = require("slugify");
const multer = require("multer");

const fs = require("fs");
const _ = require("lodash");

// set storage
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },

  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" || ext !== ".png") {
      return cb(res.status(400).end("only jpg, png are allowed"), false);
    }
    cb(null, true);
  },
});

var uploadImage = multer({ storage: storage }).single("file");

exports.upload = (req, res) => {
  uploadImage(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
    }
    console.log("file has been uploaded");
    return res.json({
      success: true,
      image: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
};

exports.create = (req, res) => {
  //save all the data we got from the client into the DB
  console.log(req.body);
  const slug = slugify(req.body.title).toLowerCase();
  req.body.slug = slug;
  const property = new Property(req.body);

  property.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Property.findOne({ slug })
    // .select("-photo")
    .populate("project_by", "name")
    .populate("project_amenities", "amenity")

    // .select("title location rera_number address price slug  type group createdAt ")
    .exec((err, data) => {
      if (err) {
        return res.json({
          err,
        });
      }
      res.json(data);
    });
};

exports.remove = (req, res) => {
  let property = req.property;
  property.remove((err, deletedproperty) => {
    if (err) {
      return res.status(400).json({
        error,
      });
    }

    res.json({
      deletedproperty,
      message: "Property deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  const property = req.property;
  property.name = req.location.name;
  property.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.list = (req, res) => {
  Property.find().exec((err, find) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(find);
  });
};

exports.listSearch = (req, res) => {
  console.log(req.query);
  const { query, area } = req.query;
  console.log(query);
  console.log(area);

  Property.find(
    {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { project_group: { $regex: area, $options: "i" } },

        // { city: { $regex: query, $options: "i" } },
      ],
    },
    (err, property) => {
      if (err) {
        return err;
      }
      res.json(property);
    }
  );
};

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 6;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          //greater than
          //less than
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Property.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};
