const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../features/users/UserModel");

exports.isAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Unauthorized",
    });
  }
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : false;
  try {
    const user = await User.findOne({ accessToken: token });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Unauthorized" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
      if (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          msg: "Unauthorized",
        });
      }
      req.userData = jwt.decode(token);
    });
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: error.message,
    });
  }
};
