const connection = require("../../config/mysql");
// 	reject(new Error(`Message : ${error.message}`));
module.exports = {
	register: (data) =>
		new Promise((resolve, reject) => {
			connection.query("INSERT INTO users SET ?", data, (error, results) => {
				if (!error) {
					const newDataResults = {
						id: results.insertId,
						...data,
					};
					delete newDataResults.phoneNumber;
					delete newDataResults.role;
					resolve(newDataResults);
				} else {
					reject(new Error(`Message  : ${error.message}`));
				}
			});
		}),
	getUserByEmail: (email) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM users WHERE email = ?",
				email,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	updateByPassword: (password, id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"UPDATE users SET password = ? WHERE id = ?",
				[password, id],
				(error, results) => {
					if (!error) {
						const newPassword = {
							id: id,
						};
						// console.log(password);
						resolve(newPassword);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	activateEmail: (status, id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"UPDATE users SET status = ? WHERE id = ?",
				[status, id],
				(error) => {
					if (!error) {
						const newDataStatus = {
							status,
						};
						resolve(newDataStatus);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
};
