import helmet from "helmet";
import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import authRoute from "./src/features/auth/authRoute";
import usersRoute from "./src/features/users/usersRoute";
import postsRoute from "./src/features/posts/postsRoute";
import commentsRoute from "./src/features/comments/commentsRoute";
import isAuth  from "./src/middleware/isAuthenticatedMiddleware";
const app = express();

// CONFIGURATIONS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", isAuth, usersRoute);
app.use("/api/v1/posts", isAuth, postsRoute);
app.use("/api/v1/comments", isAuth, commentsRoute);

export default app;
