const mysql = require("mysql2");
const bcrypt = require("bcrypt");
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

const createUsersTableIfNotExists = async () => {
  return new Promise((resolve, reject) => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS t_users (
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(70) NOT NULL UNIQUE,
        isAdmin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    connection.query(createTableQuery, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Fonction permettant de créer un utilisateur
const createUser = async (username, password, isAdmin = false) => {
  return new Promise(async (resolve, reject) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const insertQuery =
      "INSERT INTO t_users (username, password, isAdmin) VALUES (?, ?, ?)";
    connection.query(
      insertQuery,
      [username, hashedPassword, isAdmin],
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
const logUser = async (username) => {
  return new Promise(async (resolve, reject) => {
    const user = await findUserByUsername(username);
    if (!user) {
      reject("User not found");
    } else {
      resolve(user);
    }
  });
};

function getAllUsers() {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT username, password FROM t_users",
      (error, results) => {
        if (error) return reject(error);
        resolve(results);
      }
    );
  });
}

const createTwoUsers = async () => {
  try {
    await createUser("admin", "admin", true);
    await createUser("user", "user", false);
    console.log("Users created successfully");
  } catch (error) {
    console.error("Error creating users:", error);
  }
};

const searchUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const selectQuery = "SELECT * FROM t_users WHERE username LIKE ?";
    connection.query(selectQuery, [`%${username}%`], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Appel de la fonction pour créer les utilisateurs
createTwoUsers();

module.exports = {
  connection,
  connectionToDatabase,
  createUsersTableIfNotExists,
  createUser,
  findUserByUsername,
  logUser,
  getAllUsers,
  createTwoUsers,
  searchUserByUsername,
};
