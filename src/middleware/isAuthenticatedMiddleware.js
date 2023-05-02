const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

function generateToken(username) {
  return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
}

exports.isAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Unauthorized",
    });
  }
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : false;
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
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
