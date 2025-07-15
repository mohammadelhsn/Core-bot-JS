require("dotenv").config();
const mysql = require("mysql2");

async function initiateConnection() {
	const con = await mysql.createPool({
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
	});
	return con;
}

module.exports = initiateConnection();
