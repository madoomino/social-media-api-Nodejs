const { Schema, model } = require("mongoose");

const userSchema = new Schema(
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
      required: true,
      unique: true,
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

module.exports = model("User", userSchema);
