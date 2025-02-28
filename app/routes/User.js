const express = require("express");
const { authenticateToken } = require("../auth/jwt");
const getAllUsers = require("../db/mysql").getAllUsers;

const router = express.Router();
const controller = require("../controllers/UserController");

// Route permettant d'afficher la page de login
router.get("/login", controller.login);

// Route permettant d'afficher la page d'inscription
router.get("/register", controller.register);

// Route permettant de connecter un utilisateur
router.post("/login", controller.logUser);

router.get("/homepage", authenticateToken, controller.homepage);

// Route permettant d'inscrire un utilisateur
router.post("/register", controller.registerUser);

router.get("/profile", authenticateToken, controller.profile);

// Nouvelle route pour obtenir le nom d'utilisateur
router.get("/api/getUsername", authenticateToken, async (req, res) => {
  if (req.user.isAdmin) {
    const users = await getAllUsers();
    res.json({ username: req.user.username, users });
  } else {
    res.json({ username: req.user.username });
  }
});

// Route pour la déconnexion
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

router.get("/api/searchUser", authenticateToken, async (req, res) => {
  if (req.user.isAdmin) {
    await controller.searchUserByUsername(req, res);
  } else {
    res.status(403).json({ error: "Access denied" });
  }
});

module.exports = router;
