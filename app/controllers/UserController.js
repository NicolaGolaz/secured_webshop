const path = require("../server");
module.exports = {
  get: (req, res) => {
    res.send("User: nicola Test");
  },

  login: (req, res) => {
    res.sendFile("view/login.html", { root: "." });
  },
  register: (req, res) => {
    res.sendFile("view/register.html", { root: "." });
  },
};
