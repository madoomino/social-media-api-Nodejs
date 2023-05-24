import { Router } from "express";
import { login, register, logout, resetPassword } from "./authController";
import { handleRefreshToken } from "./refreshTokenController";
import isAuth from "../../middleware/isAuthenticatedMiddleware";
const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/refresh").get(handleRefreshToken);
router.route("/reset-password").post(isAuth, resetPassword);

export default router;
