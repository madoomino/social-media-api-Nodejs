const jwt = require("jsonwebtoken");
const User = require("../users/UserModel");
const { StatusCodes } = require("http-status-codes");

exports.handleRefreshToken = async (req, res) => {
  // # checking for refresh token cookie
  const cookies = req.cookies;

  // - not found? return unauthorized
  if (!cookies?.jwt) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Unauthorized" });
  }

  // # found? check if db_user_doc contains refresh token
  const refreshToken = cookies.jwt;
  try {
    const user = await User.findOne({ refreshToken });
    // - not in db_user_doc? return invalid user data
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid user data" });
    }
    // # found? check if token is valid
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      // - not valid? return invalid user data
      if (err) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ msg: "Invalid user data" });
      }
      // - valid? create access token and return it
      const accessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );
      return res.status(StatusCodes.CREATED).json({ accessToken });
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};
