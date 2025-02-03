const express = require("express");

const router = express.Router();
const controller = require("../controllers/UserController");

// Route permettant d'afficher la page de login
router.get("/login", controller.login);

// Route permettant d'afficher la page d'inscription
router.get("/register", controller.register);

// Route permettant de connecter un utilisateur
router.post("/login", controller.logUser);

// Route permettant d'inscrire un utilisateur
router.post("/register", controller.registerUser);

module.exports = router;
