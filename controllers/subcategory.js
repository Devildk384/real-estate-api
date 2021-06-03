const SubCategory = require("../models/subcategory");
var slugify = require("slugify");

exports.create = (req, res) => {
  const { name, category } = req.body;
  let slug = slugify(name).toLowerCase();

  let subcategory = new SubCategory({ name, slug, category });

  subcategory.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    res.json(data);
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  SubCategory.findOne({ slug }).exec((err, subcategory) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    const { name, category } = subcategory;

    res.json({ subcategory: name, category });
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  SubCategory.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: `${slug} -  SubCategory deleted successfully  `,
    });
  });
};

exports.list = (req, res) => {
  SubCategory.find().exec((err, find) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(find);
  });
};
