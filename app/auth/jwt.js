const jwt = require("jsonwebtoken");
const secretKey = require("./secretKey");

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, isAdmin: user.isAdmin },
    secretKey,
    {
      expiresIn: "1h",
    }
  );
}

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    // res.status(401).send("Access denied");
    res.redirect("/login");
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
}

module.exports = { generateToken, authenticateToken };
