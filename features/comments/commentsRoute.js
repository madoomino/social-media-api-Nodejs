const { createComment } = require("./commentsController");

const router = require("express").Router();

router.route("/").post(createComment);

module.exports = router;
