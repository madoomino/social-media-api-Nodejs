const Comment = require("./CommentModel");
const User = require("../users/UserModel");
const Post = require("../posts/PostModel");
const { StatusCodes } = require("http-status-codes");

exports.createComment = async (req, res) => {
  const { body, parentCommentId, relatedPostId } = req.body;

  try {
    if (!body || relatedPostId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "No body added",
      });
    }

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "Invalid parent comment id",
        });
      }
    }

    const user = await User.findById(req.userData.id);
    const comment = await Comment.create({
      body,
      parentCommentId,
      userId: user.id,
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: error.message,
    });
  }
};
