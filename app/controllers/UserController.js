const path = require("../server");
const { createUser } = require("../db/mysql");
module.exports = {
  login: (req, res) => {
    res.sendFile("view/login.html", { root: "." });
  },
  register: (req, res) => {
    res.sendFile("view/register.html", { root: "." });
  },
  logUser: (req, res) => {},

  // Fontion qui permet d'inscrire un utilisateur
  registerUser: async (req, res) => {
    try {
      await createUser(req.body.username, req.body.password);
      res.send("User created");
    } catch (error) {
      res.status(500).send("Error creating user");
    }
  },
};
