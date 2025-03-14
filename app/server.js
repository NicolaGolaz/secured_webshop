const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");
const {
  connectionToDatabase,
  createUsersTableIfNotExists,
  createTwoUsers,
} = require("./db/mysql");
const cookieParser = require("cookie-parser");

// explique le code ci-dessous
const app = express();
app.use(cookieParser());
const userRoute = require("./routes/User");
app.use(express.urlencoded({ extended: true })); // Pour parser les données des formulaires
app.use("/", userRoute);

// Servir les fichiers statiques depuis le dossier "view"
app.use(express.static(path.join(__dirname, "view")));

// Configuration HTTPS
const options = {
  key: fs.readFileSync("./certificat/key.pem"), // Chemin vers la clé privée
  cert: fs.readFileSync("./certificat/certificat.pem"), // Chemin vers le certificat
};

// Lancer le serveur HTTPS et vérifie la connection à la base de données
const startServer = async () => {
  try {
    await connectionToDatabase();
    await createUsersTableIfNotExists();
    await createTwoUsers();
    await https.createServer(options, app).listen(443, () => {
      console.log("Serveur HTTPS démarré sur https://localhost:443");
    });
  } catch (error) {
    console.error("Failed to connect the database !", error);
  }
};

// Lancer le serveur
startServer();
