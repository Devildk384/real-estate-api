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
} = require("../controllers/category");

router.get("/category/:slug", read);
router.post("/category/create", requireSignin, adminMiddleware, create);
router.delete("/category/:slug", requireSignin, adminMiddleware, remove);
router.put("/category/:slug", requireSignin, adminMiddleware, update);
router.get("/categories", list);

module.exports = router;
