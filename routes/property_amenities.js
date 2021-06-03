/** @format */

const express = require("express");
const router = express.Router();

const { requireSignin, adminMiddleware } = require("../controllers/admin");
const {
  create,
  read,
  remove,
  update,
  list,
} = require("../controllers/property_amenities");

router.post("/amenity/create", requireSignin, adminMiddleware, create);
// router.delete("/admin-type/:slug", requireSignin, adminMiddleware, remove);
// router.put("/admin-type/:slug", requireSignin, adminMiddleware, update);
router.get("/amenities", list);

module.exports = router;
