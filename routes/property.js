/** @format */

const express = require("express");
const router = express.Router();
const store = require("../helpers/multer");

const { requireSignin, adminMiddleware } = require("../controllers/admin");
const {
  remove,
  update,
  list,
  read,
  create,
  upload,
  listSearch,
  listBySearch,
} = require("../controllers/property");

router.post("/property/uploadImage", requireSignin, adminMiddleware, upload);
router.post("/property/create", requireSignin, adminMiddleware, create);
router.get("/property/:slug", read);
router.delete("/property/:slug", requireSignin, adminMiddleware, remove);
router.put("/property/:slug", requireSignin, adminMiddleware, update);
router.get("/properties", list);
router.get("/searchproperty", listSearch);
router.post("/property/by/search", listBySearch);

router.get("/test", requireSignin, (req, res) => {
  console.log(req.cookies.token);
});

// jwt.verify(
//   token,
//   global.config.secretKey,
//   {
//     algorithm: global.config.algorithm,
//   },
//   function (err, decoded) {
//     if (err) {
//       let errordata = {
//         message: err.message,
//         expiredAt: err.expiredAt,
//       };
//       console.log(errordata);
//       return res.status(401).json({
//         message: "Unauthorized Access",
//       });
//     }
//     req.decoded = decoded;
//     console.log(decoded);
//     next();
//   }
// );

module.exports = router;
