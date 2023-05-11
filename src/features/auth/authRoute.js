const { Router } = require("express");
const { login, register, logout, resetPassword } = require("./authController");
const { handleRefreshToken } = require("./refreshTokenController");
const { isAuth } = require("../../middleware/isAuthenticatedMiddleware");
const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/refresh").get(handleRefreshToken);
router.route("/reset-password").post(isAuth, resetPassword);

module.exports = router;
