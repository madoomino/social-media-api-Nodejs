const helmet = require("helmet");
const express = require("express");
const app = express();
const authRoute = require("./src/features/auth/authRoute");
const usersRoute = require("./src/features/users/usersRoute");
const postsRoute = require("./src/features/posts/postsRoute");
const commentsRoute = require("./src/features/comments/commentsRoute");
const { isAuth } = require("./src/middleware/isAuthenticatedMiddleware");

// CONFIGURATIONS
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/posts", isAuth, postsRoute);
app.use("/api/v1/comments", isAuth, commentsRoute);

module.exports = app;
