const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
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
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//   })
// );
app.use(cookieParser());

// ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", isAuth, usersRoute);
app.use("/api/v1/posts", isAuth, postsRoute);
app.use("/api/v1/comments", isAuth, commentsRoute);

module.exports = app;
