const redis = require("../config/redis");
const helperResponse = require("../helpers/wrapper");
module.exports = {
	// REDIS MOVIE
	getMovieByIdRedis: (request, response, next) => {
		const { id } = request.params;
		redis.get(`getMovie:${id}`, (error, results) => {
			if (!error && results !== null) {
				// jika tidak ada error dan datanya ada
				const newResult = JSON.parse(results);
				return helperResponse.response(
					response,
					200,
					`Berhasil mendapatkan movie id!`,
					newResult
				);
			} else {
				next();
			}
		});
	},
	getMovieRedis: (request, response, next) => {
		// Pengecekan 2 Model Query
		redis.get(`getMovie:${JSON.stringify(request.query)}`, (error, results) => {
			// Berdasarkan Pencarian
			if (!error && results !== null) {
				const newResult = JSON.parse(results);
				return helperResponse.response(
					response,
					200,
					"Berhasil mengambil data movie berdasarkan pencarian!",
					newResult.newDataMovie,
					newResult.pageInfo
				);
			} else {
				// Berdasarkan semua data movie atau endpoint => '/movie'
				redis.get(`getMovie:all`, (error, results) => {
					if (!error && results !== null) {
						const newResult = JSON.parse(results);
						return helperResponse.response(
							response,
							200,
							"Berhasil mengambil semua data movie!",
							newResult.allMovie,
							newResult.pageInfo
						);
					} else {
						next();
					}
				});
			}
		});
	},
	clearDataMovieRedis: (request, response, next) => {
		redis.keys("getMovie:*", (error, results) => {
			if (results.length > 0) {
				results.forEach((value) => {
					redis.del(value);
				});
			}
			next();
		});
	},

	// REDIS SCHEDULE
	getScheduleRedis: (request, response, next) => {
		redis.get(
			`getSchedule:${JSON.stringify(request.query)}`,
			(error, results) => {
				if (!error && results !== null) {
					const newDataSchedule = JSON.parse(results);
					return helperResponse.response(
						response,
						200,
						"berhasil mendapatkan data sesuai pencarian!",
						newDataSchedule.results,
						newDataSchedule.pageInfo
					);
				} else {
					// redis.get(`getSchedule:all`, (error, results) => {
					// 	const newAllData = JSON.parse(results);
					// 	if (!error && results !== null) {
					// 		return helperResponse.response(
					// 			response,
					// 			200,
					// 			"berhasil mendapatkan semua data!",
					// 			newAllData.allSchedule,
					// 			newAllData.pageAllData
					// 		);
					next();
				}
			}
		);
	},

	getScheduleByIdRedis: (request, response, next) => {
		const id = request.params.id;
		redis.get(`getSchedule:${id}`, (error, results) => {
			if (!error && results !== null) {
				const newDataSchedule = JSON.parse(results);
				return helperResponse.response(
					response,
					200,
					"berhasil mendapatkan data schedule berdasarkan id",
					newDataSchedule
				);
			} else {
				next();
			}
		});
	},

	clearScheduleRedis: (request, response, next) => {
		redis.keys(`getSchedule:*`, (error, results) => {
			if (results.length > 0) {
				results.forEach((value) => {
					redis.del(value);
				});
			}
			next();
		});
	},
};
