const User = require("../users/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

exports.register = async (req, res) => {
  const {
    username,
    password,
    email,
    firstName,
    lastName,
    address,
    phoneNumber,
  } = req.body;
  try {
    const user = await User.create({
      username,
      password: await bcrypt.hash(password, 8),
      email,
      firstName,
      lastName,
      address,
      phoneNumber,
    });

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

    await user.updateOne({ refreshToken, accessToken });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 15,
    });

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
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Please enter email and password",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Invalid user data",
      });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Invalid user data",
      });
    }
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

    await user.updateOne({ refreshToken, accessToken });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 15,
    });

    const sanitizedUser = {
      ...user.toObject(),
      password: undefined,
      isAdmin: undefined,
      roles: undefined,
    };

    if (user.isAdmin) {
      const now = new Date();
      await User.findByIdAndUpdate(user.id, { lastLoginAt: now });
      return res.status(StatusCodes.OK).json({
        user: sanitizedUser,
        accessToken,
      });
    }

    const now = new Date();
    await User.findByIdAndUpdate(user.id, { lastLoginAt: now });
    return res.status(StatusCodes.OK).json({
      user: sanitizedUser,
      accessToken,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.toString(),
    });
  }
};

exports.logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(StatusCodes.NO_CONTENT);
  }
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
