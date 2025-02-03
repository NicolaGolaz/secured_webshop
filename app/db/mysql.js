const mysql = require("mysql2");

// Création de la connection à la base de données
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "db",
  port: 6033,
});

// Fonction permettant la connection à la base de données
const connectionToDatabase = async () => {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error("error connecting: " + err.stack);
        reject(err);
      } else {
        console.log("Connected to the MySQL server.");
        resolve(connection);
      }
    });
  });
};

// Fonction permettant de créer un utilisateur
const createUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const insertQuery =
      "INSERT INTO t_users (username, password) VALUES (?, ?)";
    connection.query(insertQuery, [username, password], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Fonction permettant de trouver un utilisateur en fonction de son nom d'utilisateur
const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const selectQuery = "SELECT * FROM t_users WHERE username = ?";
    connection.query(selectQuery, [username], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

module.exports = {
  connection,
  connectionToDatabase,
  createUser,
  findUserByUsername,
};
