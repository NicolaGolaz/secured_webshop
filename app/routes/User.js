const express = require("express");

const router = express.Router();
const controller = require("../controllers/UserController");

router.get("/", controller.get);

router.get("/login", controller.login);

router.get("/register", controller.register);

module.exports = router;
