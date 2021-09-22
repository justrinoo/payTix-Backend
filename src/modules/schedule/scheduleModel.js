const connection = require("../../config/mysql");

module.exports = {
	getScheduleSearch: (searchMoveId, searchLocation, limit, offset, sort) =>
		new Promise((resolve, reject) => {
			connection.query(
				`SELECT * FROM movie JOIN schedule ON movie.id=schedule.movie_id WHERE movie_id = ? OR location LIKE ? ORDER BY price ${sort} LIMIT ? OFFSET ?`,
				// SELECT * FROM movie JOIN schedule ON movie.id=schedule.movie_id WHERE movie_id = 4 OR location LIKE "%kawkaokwoakw%" ORDER BY price ASC LIMIT 2 OFFSET 0
				[searchMoveId, `%${searchLocation}%`, limit, offset, sort],
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
			connection.query(
				"SELECT * FROM movie JOIN schedule ON movie.id=schedule.movie_id ORDER BY movie.title",
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.sqlMessage}`));
					}
				}
			);
			// console.log(query);
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
