/** @format */

const express = require("express");

const router = express.Router();
const {
  login,
  signup,
  signout,
  auth,
  forgotPassword,
  resetPassword,
  googleLogin,
  update,
  userById,
} = require("../controllers/admin.js");
const { requireSignin, authMiddleware } = require("../controllers/admin");

const { forgotPasswordValidator, resetPasswordValidator } =
  "../validator/auth.js";

router.post("/signup", signup);
router.post("/login", login);
router.get("/signout", signout);
router.get("/auth", auth);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.put("/user-update/:userId", update);

router.param("userId", userById);
router.post("/google-login", googleLogin);

module.exports = router;
