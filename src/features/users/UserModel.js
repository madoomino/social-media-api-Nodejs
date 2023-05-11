const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mongoose User Schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please provide a valid email"],
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address: {
      city: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    phoneNumber: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    roles: {
      type: [String],
      default: ["user"],
    },
    preferences: {
      language: {
        type: String,
        default: "en",
      },
    },
    refreshToken: String,
    accessToken: String,
  },
  { timestamps: true }
);

// Mongoose User Methods (statics & methods)

// checks if pwd > 8 chars, contains at least one (capitalized letter, number, special char)
// returns boolean value
UserSchema.statics.isValidPassword = function (plainTextPassword) {
  const regEx = /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  const isValidPassword = regEx.test(plainTextPassword);
  return isValidPassword;
};

// hashes the plain pwd
UserSchema.statics.hashPassword = async function (plainTextPassword) {
  const hash = await bcrypt.hash(plainTextPassword, 8);
  return hash;
};

// compares the db_user_pwd wuth the provided login_pwd
// returns boolean value
UserSchema.methods.comparePasswords = async function (plainTextPassword) {
  const userHashedPassword = this.password; // db_user_pwd

  const isCorrectPassword = await bcrypt.compare(
    plainTextPassword,
    userHashedPassword
  );
  return isCorrectPassword;
};

// generates 2 JWTs (REFRESH_TOKEN, ACCESS_TOKEN) using db_user data
UserSchema.methods.generateTokens = async function () {
  const user = this;
  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "15d",
    }
  );

  const accessToken = jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

  return { refreshToken, accessToken };
};

module.exports = model("User", UserSchema);
