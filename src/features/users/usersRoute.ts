import { Router } from "express";
import { getUserData } from "./usersController";

const router = Router();

router.route("/:id").get(getUserData);

export default router;
