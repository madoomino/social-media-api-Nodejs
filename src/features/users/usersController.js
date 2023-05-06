const { StatusCodes } = require("http-status-codes");
const User = require("../users/UserModel");

exports.getUserData = async (req, res) => {
  // # checking for id existence in url
  const { id } = req.params;

  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "No user id provided",
    });
  }
  try {
    // # checking if there's a user with id
    const user = await User.findOne({ _id: id }).select(
      "username firstName lastName -_id"
    );
    // - not found? return invalid msg
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Invalid user id",
      });
    }
    // - found? return user data
    return res.status(StatusCodes.ACCEPTED).json(user);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};
