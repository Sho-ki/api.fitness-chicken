const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "34.134.121.66",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "123",
  database: process.env.DB_NAME || "workout_app_backend",
});

module.exports = connection;
