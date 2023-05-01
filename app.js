const express = require("express");
const cookieParser = require("cookie-parser");

// Routes
const authRoute = require("./features/auth/authRoute");
const { isAuth } = require("./features/auth/isAuthenticatedMiddleware");
const commentsRoute = require("./features/comments/commentsRoute");
const postsRoute = require("./features/posts/postsRoute");
const usersRoute = require("./features/users/usersRoute");

// INITIALIZING APP
const app = express();

// APP CONFIGURATIONS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// AUTH ROUTE
app.use("/api/v1/auth", authRoute);

// USERS ROUTE
app.use("/api/v1/users", usersRoute);
// COMMENTS ROUTE
app.use("/api/v1/comments", isAuth, commentsRoute);

// POSTS ROUTE
app.use("/api/v1/posts", isAuth, postsRoute);

module.exports = app;
