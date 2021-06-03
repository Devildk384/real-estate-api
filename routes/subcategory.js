const express = require("express");
const router = express.Router();

const { requireSignin, adminMiddleware } = require("../controllers/admin");
const { create, read, remove, list } = require("../controllers/subcategory");

router.get("/subcategory/:slug", read);
router.post("/subcategory/create", requireSignin, adminMiddleware, create);
router.delete("/subcategory/:slug", requireSignin, adminMiddleware, remove);
router.get("/subcategories", list);

module.exports = router;
