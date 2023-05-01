const express = require("express");
const cookieParser = require("cookie-parser");

// Routes
const authRoute = require("./features/users/authRoute");
const { isAuth } = require("./features/users/isAuthenticatedMiddleware");
const commentsRoute = require("./features/comments/commentsRoute");
const jwt = require("jsonwebtoken");

// INITIALIZING APP
const app = express();

// APP CONFIGURATIONS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// AUTH ROUTES
app.use("/api/v1/auth", authRoute);

//COMMENT ROUTE
app.use("/api/v1/comments", isAuth, commentsRoute);

// POST ROUTES
app.get("/posts", isAuth, (req, res) => {
  return res.status(200).json({
    data: req.userData,
  });
});

app.get("/test", (req, res) => {
  const token = req.body.token;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return res.status(200).send("cool");
  } catch (error) {
    return res.status(401).json({
      msg: error.toString(),
    });
  }
  res.status(200).send(req.token);
});

module.exports = app;
