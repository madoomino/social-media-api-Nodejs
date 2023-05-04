const jwt = require("jsonwebtoken");
const User = require("../users/UserModel");
const { StatusCodes } = require("http-status-codes");

exports.handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Unauthorized" });
  }
  const refreshToken = cookies.jwt;
  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid user data" });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ msg: "Invalid user data" });
      }
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
