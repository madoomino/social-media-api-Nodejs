const router = require("express").Router();
const { getUserData } = require("./usersController");
const { isAdmin } = require("../../middleware/isAdminMiddleware");

router.route("/:id").get(isAdmin, getUserData);

module.exports = router;
