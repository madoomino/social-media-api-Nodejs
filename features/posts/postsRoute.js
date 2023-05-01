const router = require("express").Router();
const { createPost, getUserPosts } = require("./postsController");
const { isAuth } = require("../auth/isAuthenticatedMiddleware");

router.route("/").post(isAuth, createPost);
router.route("/:id").get(getUserPosts);

module.exports = router;
