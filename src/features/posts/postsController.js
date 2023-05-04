const Post = require("./PostModel");
const User = require("../users/UserModel");
const { StatusCodes } = require("http-status-codes");

exports.createPost = async (req, res) => {
  const { body, userId, image, tags, hashtags } = req.body;
  if (!body || !userId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Missing fields",
    });
  }
  try {
    const post = await Post.create({
      body,
      userId,
      tags: tags || undefined,
      hashtags: hashtags || undefined,
    });
    return res.status(StatusCodes.CREATED).json(post);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message(),
    });
  }
};

exports.getUserPosts = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Invalid user id",
    });
  }
  try {
    const posts = await Post.find({ userId: id });
    return res.status(StatusCodes.ACCEPTED).json(posts);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};