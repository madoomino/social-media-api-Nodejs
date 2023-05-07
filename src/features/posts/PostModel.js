const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  body: {
    type: String,
    max: 4096,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: {
    type: [String],
    default: [""],
  },
  tags: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  hashtags: {
    type: [{ type: String }],
    default: [],
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
