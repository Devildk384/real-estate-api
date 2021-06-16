/** @format */

const express = require("express");

const router = express.Router();
const {
  propertyList,
  blogList,
  ApproveBloglist,
  ApprovePropertylist,
  approveProperty,
  approveBlog,
  blogRemove,
  propertyremove,
} = require("../controllers/admin_auth.js");
const { requireSignin, adminMiddleware } = require("../controllers/admin");

router.get("/allproperties", requireSignin, adminMiddleware, propertyList);
router.get("/allblogs", requireSignin, adminMiddleware, blogList);
router.get(
  "/approve-properties",
  requireSignin,
  adminMiddleware,
  ApprovePropertylist
);
router.get("/approve-blogs", requireSignin, adminMiddleware, ApproveBloglist);
router.put(
  "/approve-property/:slug",
  requireSignin,
  adminMiddleware,
  approveProperty
);
router.put(
  "/approve-property/:slug",
  requireSignin,
  adminMiddleware,
  approveBlog
);
router.delete(
  "/delete-property/:slug",
  requireSignin,
  adminMiddleware,
  propertyremove
);
router.delete("/delete-blog/:slug", requireSignin, adminMiddleware, blogRemove);

module.exports = router;
