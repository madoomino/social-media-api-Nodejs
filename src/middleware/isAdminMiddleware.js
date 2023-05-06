const User = require("../features/users/UserModel");
const { StatusCodes } = require("http-status-codes");

// TODO
exports.isAdmin = async (req, res, next) => {
  // # If the request reached here
  //      that means that there's an authenticated user.

  // # Checking here if (user is admin) is more secure
  //      than sending the property value from isAuth directly.

  try {
    // # checking for user existence
    const user = await User.findById(req.userData.id);

    // - not found? return unauthorized
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Unauthorized",
      });
    }
    // # found? check if db_user_doc roles array has admin value
    const isAdmin = user.roles.includes("admin");

    // - not found? return unauthorized
    if (!isAdmin) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Unauthorized",
      });
    }

    // - found? allow user to access route
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};
