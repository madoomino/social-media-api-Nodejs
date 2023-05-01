const User = require("./User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const token = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "15d" }
    );
    const strUser = JSON.stringify(user);
    const parsedUser = JSON.parse(strUser);
    delete parsedUser.password;
    delete parsedUser.isAdmin;
    delete parsedUser.roles;
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      msg: "created",
      parsedUser,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(302).json({
        msg: "Please enter email and password",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(302).json({
        msg: "Invalid credentials",
      });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(302).json({
        msg: "Invalid credentials",
      });
    }
    const refreshToken = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "15d" }
    );
    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    if (user.isAdmin) {
      return res.status(200).json({
        msg: "Welcome back, Admin",
        refreshToken,
        accessToken,
      });
    }
    return res.status(200).json({
      msg: "Logged in",
      refreshToken,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};
