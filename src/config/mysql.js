const mysql = require("mysql2");

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "paytix",
});

connection.connect((err) => {
	if (err) {
		console.log("Failed to connect database...", err.message);
	}
	console.log("Successfully to connect database...");
});

module.exports = connection;
