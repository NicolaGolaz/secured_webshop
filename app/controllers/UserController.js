const path = require("../server");
const { createUser } = require("../db/mysql");
const { logUser } = require("../db/mysql");
const { generateToken } = require("../auth/jwt");
const bcrypt = require("bcrypt");
const { searchUserByUsername } = require("../db/mysql");

module.exports = {
  login: (req, res) => {
    res.sendFile("view/login.html", { root: "." });
  },
  register: (req, res) => {
    res.sendFile("view/register.html", { root: "." });
  },

  logUser: async (req, res) => {
    try {
      const user = await logUser(req.body.username);
      console.log(user);
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = generateToken(user);
        console.log(token);
        res.cookie("token", token, { httpOnly: true, secure: true });
        console.log(res);
        res.redirect("/homepage");
      } else {
        res.status(401).send("Invalid username or password");
      }
    } catch (error) {
      res.status(500).send("Error login");
    }
  },

  // Fontion qui permet d'inscrire un utilisateur
  registerUser: async (req, res) => {
    try {
      await createUser(req.body.username, req.body.password);
      console.log("User created");
      res.sendFile("view/login.html", { root: "." });
    } catch (error) {
      res.status(500).send("Error creating user");
    }
  },

  homepage: (req, res) => {
    res.sendFile("view/homepage.html", { root: "." });
  },

  profile: (req, res) => {
    res.sendFile("view/profile.html", { root: "." });
  },

  searchUserByUsername: async (req, res) => {
    const username = req.query.username;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    try {
      const users = await searchUserByUsername(username);
      if (users.length === 0) {
        return res.status(404).json({ error: "No users found" });
      }
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
