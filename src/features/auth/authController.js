const User = require("../users/UserModel");
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
  try {
    // # check if req.password is valid
    const isValidPassword = await User.isValidPassword(password);

    if (!isValidPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "password should be at least 8 chars, contains (number, capitalized letter, special char).",
      });
    }

    // # no missing fields and pwd is valid? create user (only with allowed fields)
    const user = await User.create({
      username,
      password: await User.hashPassword(password),
      email,
      firstName,
      lastName,
      address: req.address || undefined,
      phoneNumber: req.phoneNumber || undefined,
      /*
        In this case (req.address || undefined) = (req?.address) = (req.address) = (req.address ?? undefined).
        I choose the first syntax for more clarity.
      */
    });

    // - create refresh token and access token
    const { refreshToken, accessToken } = await user.generateTokens();

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
    const isValid = await user.comparePasswords(password, user.password);

    // - not valid? return invalid user data error
    if (!isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Invalid user data",
      });
    }
    // - valid? create refresh token and access token
    const { refreshToken, accessToken } = await user.generateTokens();

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

exports.resetPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Missing fields",
    });
  }

  const isValidPassword = await User.isValidPassword(newPassword);

  if (!isValidPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "password should be at least 8 chars, contains (number, capitalized letter, special char).",
    });
  }

  try {
    const user = await User.findById(req.userData.id);
    const isTheSamePassword = await user.comparePasswords(oldPassword);
    if (!isTheSamePassword) {
      return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    const newHashedPassword = await User.hashPassword(newPassword);
    await user.updateOne({ password: newHashedPassword });
    return res.status(StatusCodes.OK).json({
      msg: "Password updated",
    });
  } catch (error) {}
};
