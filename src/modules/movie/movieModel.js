const connection = require("../../config/mysql");

module.exports = {
	getMovieByFilter: (searchName, sortName, sortDate, limit, offset) =>
		new Promise((resolve, reject) => {
			connection.query(
				`SELECT * FROM movie WHERE title LIKE ? ORDER BY title ${sortName}, releaseDate ${sortDate} LIMIT ? OFFSET ?`,
				[`%${searchName}%`, limit, offset, sortName, sortDate],

				function (err, results) {
					if (!err) {
						resolve(results);
					} else {
						reject(new Error(`SQL : ${err.sqlMessage}`));
					}
				}
			);
		}),
	getAllMovie: () =>
		new Promise((resolve, reject) => {
			connection.query("SELECT * FROM movie", (error, results) => {
				if (!error) {
					resolve(results);
				} else {
					reject(new Error(`SQL : ${err.sqlMessage}`));
				}
			});
		}),
	getMovieId: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM movie WHERE id = ?",
				id,
				function (err, results) {
					console.log(err);
					console.log(results);
					if (!err) {
						resolve(results);
					} else {
						reject(new Error(`SQL : ${err.sqlMessage}`));
					}
				}
			);
		}),
	getCountMovie: () =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT COUNT(*) AS total FROM movie",
				(error, results) => {
					if (!error) {
						resolve(results[0].total);
					} else {
						reject(new Error(`SQL : ${err.sqlMessage}`));
					}
				}
			);
		}),
	postMovie: (data) =>
		new Promise((resolve, reject) => {
			connection.query("INSERT INTO movie SET ?", data, (err, results) => {
				if (!err) {
					const newResult = {
						id: results.insertId,
						...data,
					};
					resolve(newResult);
				} else {
					reject(new Error(`SQL : ${err.sqlMessage}`));
				}
			});
		}),
	updateMovie: (data, id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"UPDATE movie SET ? WHERE id = ?",
				[data, id],
				(error) => {
					if (!error) {
						const newResult = {
							id,
							...data,
						};
						resolve(newResult);
					} else {
						reject(new Error(`SQL : ${error.sqlMessage}`));
					}
				}
			);
		}),
	deleteMovie: (id) =>
		new Promise((resolve, reject) => {
			connection.query("DELETE FROM movie WHERE id = ?", id, (error) => {
				if (!error) {
					resolve(id);
				} else {
					reject(new Error(`SQL : ${err.sqlMessage}`));
				}
			});
		}),
};
