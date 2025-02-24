const jwt = require("jsonwebtoken");
const secretKey = require("./secretKey");

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, secretKey, {
    expiresIn: "1h",
  });
}

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access denied");

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    console.log("Token Ok", token);
    next();
  });
}

module.exports = { generateToken, authenticateToken };
