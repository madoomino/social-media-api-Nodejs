const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    maxLength: 2048,
    required: true,
  },
  relatedPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
