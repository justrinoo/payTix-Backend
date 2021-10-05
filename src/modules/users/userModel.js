const connection = require("../../config/mysql");

module.exports = {
	getUserById: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT users.id,users.firstName,users.lastName,users.email,users.phoneNumber,users.role,users.image FROM users WHERE id = ?",
				id,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	updateProfile: (data, id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"UPDATE users SET ? WHERE id = ?",
				[data, id],
				(error) => {
					if (!error) {
						const newData = {
							id: id,
							...data,
						};
						resolve(newData);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	dashboard: (movieId, location, premier) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT MONTH(b.createdAt) as month, SUM(b.totalPayment) as total FROM booking b JOIN schedule ON b.scheduleId=schedule.id_schedule WHERE b.movieId = ? AND schedule.location LIKE ? AND schedule.premiere LIKE ? AND YEAR(b.createdAt) = YEAR(CURDATE()) GROUP BY month(b.createdAt)",
				[movieId, `%${location}%`, `%${premier}%`],
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	updateImage: (image, userId) =>
		new Promise((resolve, reject) => {
			connection.query(
				"UPDATE users SET image = ? WHERE id = ?",
				[image, userId],
				(error) => {
					if (!error) {
						const newImage = {
							id: userId,
							image,
						};
						resolve(newImage);
					} else {
						reject(new Error(`Message  : ${error.message}`));
					}
				}
			);
		}),
};
