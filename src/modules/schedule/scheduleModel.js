const connection = require("../../config/mysql");

module.exports = {
	getAllSchedule: (searchLocation, limit, offset) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM movie JOIN schedule ON movie.id=schedule.movie_id WHERE location LIKE ? ORDER BY location ASC LIMIT ? OFFSET ?",
				// SELECT * FROM movie JOIN schedule ON movie.id=schedule.movie_id WHERE title LIKE "%shin%" ORDER BY location LIMIT 1 OFFSET 0
				[`%${searchLocation}%`, limit, offset],
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.sqlMessage}`));
					}
				}
			);
		}),
	getScheduleByMovieId: (searchMoveId, limit, offset) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM movie JOIN schedule ON movie.id=schedule.movie_id WHERE movie_id LIKE ? ORDER BY location ASC LIMIT ? OFFSET ?",
				[`%${searchMoveId}%`, limit, offset],
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.sqlMessage}`));
					}
				}
			);
		}),
	totalDataSchedule: () =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT COUNT(*) as total FROM schedule",
				(error, results) => {
					if (!error) {
						resolve(results[0].total);
					} else {
						reject(new Error(`Message : ${error.sqlMessage}`));
					}
				}
			);
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
};
