/** @format */

const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { OAuth2Client } = require("google-auth-library");
const _ = require("lodash");
const sgMail = require("@sendgrid/mail"); // SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.userById = (req, res, next, id) => {
  Admin.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    req.profile = user;
    next();
  });
};

exports.signup = (req, res) => {
  console.log(req.body);
  const admin = new Admin(req.body);
  admin.phone_no = req.body.phone;
  console.log(admin);
  admin.save((err, admin) => {
    if (err) {
      return res.status(400).json({
        err,
      });
    }
    admin.salt = undefined;
    admin.hashed_password = undefined;

    res.json({
      admin,
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  Admin.findOne({ email }, (err, admin) => {
    if (err || !admin) {
      return res.status(400).json({
        error: "Admin with that email doess not exit.Please Adminstrator",
      });
    }
    if (!admin.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password dont match.",
      });
    }

    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { expireIn: "1d" });

    const { _id, name, email, role, you_are } = admin;
    console.log(admin);
    return res.json({ token, admin: { _id, email, name, role, you_are } });
  });
};

exports.update = (req, res) => {
  console.log(req.body);

  Admin.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to perform this action",
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  );
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signout success" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
});

exports.auth = (req, res) => {
  console.log(req.cookies["token"]);
  const token = req.headers.authorization;
  console.log(token);
  const admin = jwt.verify(token, process.env.JWT_SECRET);

  Admin.findById({ _id: admin._id }).exec((err, admin) => {
    if (err || !admin) {
      return res.status(400).json({
        isAuth: false,
        error: true,
      });
    }

    return res.json({
      email: admin.email,
      name: admin.name,
      _id: admin._id,
      isAdmin: admin.role === 0 ? false : true,
      isAuth: true,
      you_are: admin.you_are,
      role: admin.role,
    });
  });
};

exports.authMiddleware = (req, res, next) => {
  // const token = req.cookies["token"];
  // const admin = jwt.verify(token, process.env.JWT_SECRET);
  const adminUserId = req.admin._id;

  Admin.findById({ _id: adminUserId }).exec((err, admin) => {
    if (err || !admin) {
      return res.status(400).json({
        error: "Admin not found",
      });
    }
    req.profile = admin;
    console.log(admin);
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  Admin.findById({ _id: adminUserId }).exec((err, admin) => {
    if (err || !admin) {
      return res.status(400).json({
        error: "Admin not found",
      });
    }

    if (admin.role !== 1) {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }

    req.profile = admin;
    next();
  });
};

// exports.canUpdateDeletedStory = (req, res, next) => {
//   const slug = req.params.slug.toLowerCase();
//   Story.findOne({ slug }).exec((err, data) => {
//     if (err) {
//       return res.status(400).json({
//         error: errorHandler(err),
//       });
//     }
//     let authorizedUser =
//       data.postedBy._id.toString() === req.profile._id.toString();
//     if (!authorizedUser) {
//       return res.status(400).json({
//         error: "You are not authorized",
//       });
//     }
//     next();
//   });
// };

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  Admin.findOne({ email }, (err, admin) => {
    if (err || !admin) {
      return res.status(401).json({
        error: "admin with that email does not exist",
      });
    }

    const token = jwt.sign({ _id: admin._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
    });

    // email
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password reset link`,
      html: `
          <p>Please use the following link to reset your password:</p>
          <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
          <hr />
          <p>This email may contain sensetive information</p>
          <p>investmango.com</p>
      `,
    };
    // populating the db > user > resetPasswordLink
    return admin.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ error: errorHandler(err) });
      } else {
        sgMail.send(emailData).then((sent) => {
          return res.json({
            message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`,
          });
        });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link. Try again",
          });
        }
        Admin.findOne({ resetPasswordLink }, (err, admin) => {
          if (err || !admin) {
            return res.status(401).json({
              error: "Something went wrong. Try later",
            });
          }
          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };
          console.log(updatedFields);

          admin = _.extend(admin, updatedFields);

          console.log(admin);

          admin.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            }
            res.json({
              message: `Great! Now you can login with your new password`,
            });
          });
        });
      }
    );
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = (req, res) => {
  const idToken = req.body.tokenId;
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      // console.log(response);
      const { email_verified, name, email, jti } = response.payload;
      if (email_verified) {
        Admin.findOne({ email }).exec((err, admin) => {
          if (admin) {
            console.log(admin);
            const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
              expiresIn: "1d",
            });
            res.cookie("token", token, { expiresIn: "1d" });
            const { _id, email, name, role, username } = admin;
            return res.json({
              token,
              admin: { _id, email, name, role, username },
            });
          } else {
            // let profile = `${process.env.CLIENT_URL}/profile/${username}`;
            let password = jti + process.env.JWT_SECRET;
            const admin = new Admin({ name, email, password });

            admin.save((err, data) => {
              if (err) {
                return err;
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
              );
              res.cookie("token", token, { expiresIn: "1d" });
              const { _id, email, name, role, username } = data;
              console.log(data);
              return res.json({
                token,
                admin: { _id, email, name, role, username },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again.",
        });
      }
    });
};
