const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../features/users/UserModel");

exports.isAuth = async (req, res, next) => {
  // # getting token from auth header
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Unauthorized",
    });
  }
  // # checking if token is found or return false
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : false;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Unauthorized",
    });
  }
  try {
    // # found? check for access token in db_user_doc
    //   - not found or invalid token? return unauthorized
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
      // - found and valid? allow user to access route
      req.userData = jwt.decode(token);
    });
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: error.message,
    });
  }
};
