const { Router } = require("express");
const { login, register, logout } = require("./authController");
const { handleRefreshToken } = require("./refreshTokenController");
const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/refresh").get(handleRefreshToken);

module.exports = router;
