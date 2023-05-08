const Comment = require("./CommentModel");
const Post = require("../posts/PostModel");
const { StatusCodes } = require("http-status-codes");

exports.createComment = async (req, res) => {
  const { body, parentCommentId, relatedPostId } = req.body;
  if (!body) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Missing fields",
    });
  }

  try {
    // finidng parent comment
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "Invalid parent comment id",
        });
      }

      // finding the related post
      const relatedPost = await Post.findById(parentComment.relatedPostId);
      if (!relatedPost) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "Invalid post id",
        });
      }

      // creating a reply to parentComment
      const comment = await Comment.create({
        body,
        parentCommentId,
        relatedPostId: parentComment.relatedPostId,
        userId: req.userData.id,
      });
      return res.status(201).json(comment);
    }

    // if no parentComment
    if (!relatedPostId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Missing post id",
      });
    }
    const relatedPost = await Post.findById(relatedPostId);
    if (!relatedPost) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Invalid post id",
      });
    }

    const comment = await Comment.create({
      body,
      relatedPostId,
      userId: req.userData.id,
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: error.message,
    });
  }
};
