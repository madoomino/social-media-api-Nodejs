const router = require("express").Router();
const { createPost, getUserPosts } = require("./postsController");
const { imageUploader } = require("../../middleware/fileUploadMiddleware");

router.route("/").post(imageUploader.array("images"), createPost);
router.route("/:id").get(getUserPosts);

module.exports = router;
