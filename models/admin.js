/** @format */

const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = mongoose.Schema;

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
      lowercase: true,
    },
    phone_no: {
      type: Number,
    },
    hashed_password: {
      type: String,
      trim: true,
    },
    salt: String,
    you_are: {
      type: ObjectId,
      ref: "Admin",
      default: null,
    },
    role: {
      type: Number,
      default: 0,
    },
    company_name: {
      type: String,
      trim: true,
    },
    company_url: {
      type: String,
      trim: true,
    },
    company_profie: {
      type: String,
      trim: true,
    },

    occupation: {
      type: String,
      enum: [
        "Salaried",
        "Self Employed",
        "Professional Self Employed",
        "Retired",
        "UnEmployed",
      ],
    },
    household: {
      type: String,
      enum: [
        "upto 7000",
        "7001- 10000",
        "10001 - 15000",
        "15001-25000",
        "25001-40000",
        "Above 40000",
      ],
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },

    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

adminSchema
  .virtual("password")
  .set(function (password) {
    // create a temporary variabe called _password
    this._password = password;
    // generated salt

    this.salt = this.makeSalt();

    //encryptPassword
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

adminSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) == this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) * "";
  },
};

module.exports = mongoose.model("Admin", adminSchema);
