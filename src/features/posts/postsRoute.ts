import { Router } from "express";
import { createPost, getUserPosts } from "./postsController";
import { imageUploader } from "../../middleware/fileUploadMiddleware";

const router = Router();

router.route("/").post(imageUploader.array("images"), createPost);
router.route("/:id").get(getUserPosts);

export default router;
