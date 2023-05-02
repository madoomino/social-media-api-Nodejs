const router = require("express").Router();
const { createPost, getUserPosts } = require("./postsController");

router.route("/").post(createPost);
router.route("/:id").get(getUserPosts);

module.exports = router;
