const router = require("express").Router();
const { getUserData } = require("./usersController");

// Add routes
router.route("/:id").get(getUserData);

module.exports = router;
