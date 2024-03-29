const connection = require("../../config/mysql");

module.exports = {
	getScheduleSearch: (searchMoveId, searchLocation, limit, offset, sort) =>
		new Promise((resolve, reject) => {
			connection.query(
				`SELECT * FROM schedule WHERE ${
					searchMoveId && `movie_id = ${searchMoveId} AND`
				}  location LIKE "%${searchLocation}%" ORDER BY price ${sort} LIMIT ? OFFSET ?`,
				[limit, offset, sort],
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.sqlMessage}`));
					}
				}
			);
		}),
	getAllSchedule: () =>
		new Promise((resolve, reject) => {
			connection.query("SELECT * FROM schedule", (error, results) => {
				if (!error) {
					resolve(results);
				} else {
					reject(new Error(`Message : ${error.sqlMessage}`));
				}
			});
		}),
	totalDataSchedule: (searchMovieId, searchLocation) =>
		new Promise((resolve, reject) => {
			const query = connection.query(
				`SELECT COUNT(*) as total FROM schedule WHERE ${
					searchMovieId && "movie_id = ? AND"
				} location LIKE '%${searchLocation}%'`,
				searchMovieId,
				(error, results) => {
					console.log(error);
					if (!error) {
						console.log(results);
						resolve(results[0].total);
					} else {
						reject(new Error(`Message : ${error.sqlMessage}`));
					}
				}
			);
			console.log(query.sql);
		}),
	GetDetailSchedule: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM schedule WHERE id_schedule = ?",
				id,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.sqlMessage}`));
					}
				}
			);
		}),
	createSchedule: (data) =>
		new Promise((resolve, reject) => {
			connection.query("INSERT INTO schedule SET ?", data, (error, results) => {
				if (!error) {
					const newDataSchedule = {
						id_schedule: results.insertId,
						...data,
					};
					resolve(newDataSchedule);
				} else {
					reject(new Error(`Message : ${error.sqlMessage}`));
				}
			});
		}),
	updateSchedule: (data, id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"UPDATE schedule SET ? WHERE id_schedule = ?",
				[data, id],
				(error) => {
					if (!error) {
						const newDataSchedule = {
							id,
							...data,
						};
						resolve(newDataSchedule);
					} else {
						reject(new Error(`Message : ${error.sqlMessage}`));
					}
				}
			);
		}),
	deleteSchedule: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"DELETE FROM schedule WHERE id_schedule = ?",
				id,
				(error) => {
					if (!error) {
						resolve(id);
					} else {
						reject(new Error(`Message : ${error.sqlMessage}`));
					}
				}
			);
		}),
	getScheduleByDateStartAndEnd: (dateStart, dateEnd) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM schedule WHERE dateStart = ? AND dateEnd = ?",
				[dateStart, dateEnd],
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						new Error(`Message : ${error.message}`);
					}
				}
			);
		}),
};
