const User = require("../users/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

exports.register = async (req, res) => {
  // # getting user info from request
  const { username, password, email, firstName, lastName } = req.body;

  // # missing fields? return missing fields error
  if (!username || !password || !email || !firstName || !lastName) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Missing fields",
    });
  }
  // # no missing fields? create user (only with allowed fields)
  try {
    const user = await User.create({
      username,
      password: await bcrypt.hash(password, 8),
      email,
      firstName,
      lastName,
      address: req.address || undefined,
      phoneNumber: req.phoneNumber || undefined,
    });
    // - create refresh token adn access token
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "15d",
      }
    );

    const accessToken = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // - update db_user_doc with new 2 tokens
    await user.updateOne({ refreshToken, accessToken });

    // - add refresh token as a cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 15,
    });

    // - remove sensitive user data and return new object
    const sanitizedUser = {
      ...user.toObject(),
      password: undefined,
      isAdmin: undefined,
      roles: undefined,
    };

    return res.status(StatusCodes.CREATED).json({
      user: sanitizedUser,
      accessToken,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};

exports.login = async (req, res) => {
  // # getting fields from request
  const { email, password } = req.body;

  // - missing fields? return error
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please enter email and password",
    });
  }
  try {
    // # all fields found? check if user found (by email)
    const user = await User.findOne({ email });

    // - not found? return invalid user error
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Invalid user data",
      });
    }

    // # found? check if password is correct
    const isValid = await bcrypt.compare(password, user.password);

    // - not valid? return invalid user data error
    if (!isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Invalid user data",
      });
    }
    // - valid? create refresh token and access token
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "15d",
      }
    );

    const accessToken = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // - add 2 tokens to db_user_doc
    await user.updateOne({ refreshToken, accessToken });

    // - add refresh token as a cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 15,
    });

    // - remove sensitive user data
    const sanitizedUser = {
      ...user.toObject(),
      password: undefined,
      isAdmin: undefined,
      roles: undefined,
      refreshToken: undefined,
      accessToken,
    };

    // - update db_user_ doc last login time to the request time
    const now = new Date();
    await User.findByIdAndUpdate(user.id, { lastLoginAt: now });

    // - return user data after sanitizing it
    return res.status(StatusCodes.OK).json(sanitizedUser);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.toString(),
    });
  }
};

exports.logout = async (req, res) => {
  // # checking if refresh token cookie found?
  const cookies = req.cookies;

  // - not found? do nothing :)
  if (!cookies?.jwt) {
    return res.sendStatus(StatusCodes.NO_CONTENT);
  }
  // - found? delete it from cookies and db_user_doc
  const refreshToken = cookies.jwt;
  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(StatusCodes.NO_CONTENT);
    }
    await user.updateOne({ refreshToken: "", accessToken: "" });

    res.clearCookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 15,
    });
    return res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};
