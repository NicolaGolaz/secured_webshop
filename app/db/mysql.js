const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { generateToken } = require("../auth/jwt");
const jwt = require("jsonwebtoken");

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
const createUser = async (username, password) => {
  return new Promise(async (resolve, reject) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const insertQuery =
      "INSERT INTO t_users (username, password) VALUES (?, ?)";
    connection.query(
      insertQuery,
      [username, hashedPassword],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
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

// Fonction permettant de logger un utilisateur
const logUser = async (username, password) => {
  return new Promise(async (resolve, reject) => {
    const user = await findUserByUsername(username);
    if (!user) {
      reject("User not found");
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = generateToken(user);
        resolve(user);
      } else {
        reject("Wrong password");
      }
    }
  });
};

module.exports = {
  connection,
  connectionToDatabase,
  createUser,
  findUserByUsername,
  logUser,
};
