const Post = require("./PostModel");
const User = require("../users/UserModel");
const { StatusCodes } = require("http-status-codes");

exports.createPost = async (req, res) => {
  const { body, tags, hashtags } = req.body;
  // # checking for uploaded images using multer
  const images = req?.files;

  if (!body) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Missing fields",
    });
  }

  try {
    const post = await Post.create({
      body,
      userId: req.userData.id,
      // # found images? save their paths , no? save an empty array to db
      images: images ? images.map((image) => image.filename) : [],
      tags: tags || undefined,
      hashtags: hashtags || undefined,
    });
    return res.status(StatusCodes.CREATED).json(post);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
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
