const Comment = require("./CommentModel");
const User = require("../users/UserModel");
// const Post = require("../posts/PostModel"); TODO

exports.createComment = async (req, res) => {
  const { body, parentCommentId } = req.body;

  try {
    if (!body) {
      return res.status(301).json({
        msg: "No body added",
      });
    }
    const parentComment = await Comment.findById(parentCommentId);
    if (parentCommentId && !parentComment) {
      return res.status(401).json({
        msg: "Invalid parent comment id",
      });
    }
    const user = await User.findById(req.userData.id);
    const comment = await Comment.create({
      body,
      parentCommentId,
      userId: user.id,
    });
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(301).json({
      msg: error.message,
    });
  }
};
