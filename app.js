const express = require("express");
const cookieParser = require("cookie-parser");

// Routes
const authRoute = require("./features/auth/authRoute");
const { isAuth } = require("./features/auth/isAuthenticatedMiddleware");
const commentsRoute = require("./features/comments/commentsRoute");
const postsRoute = require("./features/posts/postsRoute");
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
// app.use("/api/v1/posts"); TODO

module.exports = app;
