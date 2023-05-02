const { StatusCodes } = require("http-status-codes");
const User = require("../users/UserModel");

exports.getUserData = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "No user id provided",
    });
  }
  try {
    const user = await User.findOne({ _id: id }).select(
      "username firstName lastName -_id"
    );

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Invalid user id",
      });
    }

    return res.status(StatusCodes.ACCEPTED).json(user);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};
