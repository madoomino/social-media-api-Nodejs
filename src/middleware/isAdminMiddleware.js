const User = require("../features/users/UserModel");
const { StatusCodes } = require("http-status-codes");

// TODO
exports.isAdmin = async (req, res, next) => {
  // # If the request reached here
  //      that means that there's an authenticated user.

  // # Checking here if (user is admin) is more secure
  //      than sending the property value from isAuth directly.

  try {
    const user = await User.findById(req.userData.id);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Unauthorized",
      });
    }
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};
