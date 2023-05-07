const router = require("express").Router();
const { getUserData } = require("./usersController");

router.route("/:id").get(getUserData);

module.exports = router;
