import { createComment } from "./commentsController";
import isAuth from "../../middleware/isAuthenticatedMiddleware";
import { Router } from "express";

const router = Router();

router.route("/").post(isAuth, createComment);

export default router;
