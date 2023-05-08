const { createComment } = require("./commentsController");
const { isAuth } = require("../../middleware/isAuthenticatedMiddleware");
const router = require("express").Router();

router.route("/").post(isAuth, createComment);

module.exports = router;
