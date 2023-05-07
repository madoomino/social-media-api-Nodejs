const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const app = express();
const authRoute = require("./src/features/auth/authRoute");
const usersRoute = require("./src/features/users/usersRoute");
const postsRoute = require("./src/features/posts/postsRoute");
const commentsRoute = require("./src/features/comments/commentsRoute");
const { isAuth } = require("./src/middleware/isAuthenticatedMiddleware");

// CONFIGURATIONS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")))

// ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", isAuth, usersRoute);
app.use("/api/v1/posts", isAuth, postsRoute);
app.use("/api/v1/comments", isAuth, commentsRoute);

module.exports = app;
