const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

function generateToken(username) {
  return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
}

exports.isAuth = (req, res, next) => {
  const token = req.body.token;
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded) {
        req.userData = decoded;
        return next();
      }
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Unauthorized",
      });
    }
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Unauthorized",
      });
    }
    const refreshToken = auth.startsWith("Bearer ")
      ? auth.split(" ")[1]
      : false;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          msg: "Unauthorized",
        });
      }
      req.body.token = generateToken(user.id);
    });
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: error.message,
    });
  }
};
