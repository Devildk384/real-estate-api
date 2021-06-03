const express = require("express");
const router = express.Router();

const { requireSignin, adminMiddleware } = require("../controllers/admin");
const {
  create,
  bloglist,
  photo,
  read,
  remove,
  listRelated
} = require("../controllers/blog.js");

// auth user story crud
router.post("/blog/create", requireSignin, adminMiddleware, create);
router.get("/blogs/list", bloglist);
router.delete("/blog/:slug", requireSignin, adminMiddleware, remove);
router.get("/blog/:slug", read);
router.get("/blog/photo/:slug", photo);
router.post('/blog/related', listRelated);

module.exports = router;
