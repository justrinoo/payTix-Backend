const movieModel = require("./movieModel");
const helperWrapper = require("../../helpers/wrapper");
const redis = require("../../config/redis");
const deleteFile = require("../../helpers/uploads/deleteFile");
const { existsSync } = require("fs");
const moment = require("moment");
module.exports = {
	getAllMovie: async (request, response) => {
		try {
			let { page, limit, searchName, sort = "ASC" } = request.query;
			page = page > 0 ? Number(page) : 1;
			limit = limit > 0 ? Number(limit) : 8;
			sort = sort === "" ? "ASC" : sort;
			searchName = searchName ? searchName : "";
			const offset = page * limit - limit;
			const totalData = await movieModel.getCountMovie(searchName);
			let totalPage = Math.ceil(totalData / limit);

			let results = await movieModel.getMovieByFilter(
				searchName,
				sort,
				limit,
				offset
			);
			console.log(results);
			const pageInfo = {
				page,
				totalPage,
				limit,
				totalData,
			};
			const allMovie = await movieModel.getAllMovie();
			if (results.length < 1) {
				if (searchName === undefined) {
					redis.setex(
						`getMovie:all`,
						3600,
						JSON.stringify({ allMovie, pageInfo })
					);
					return helperWrapper.response(
						response,
						200,
						"Berhasil mendapatkan semua data!",
						allMovie,
						pageInfo
					);
				} else {
					return helperWrapper.response(
						response,
						404,
						"Movie tidak ditemukan!"
					);
				}
			}

			let newDataMovie = [];
			for (const data in results) {
				const setNewData = {
					...results[data],
					releaseDate: results[data].releaseDate.toLocaleDateString(),
				};
				newDataMovie.push(setNewData);
			}

			redis.setex(
				`getMovie:${JSON.stringify(request.query)}`,
				3600,
				JSON.stringify({ newDataMovie, pageInfo })
			);

			return helperWrapper.response(
				response,
				200,
				"Berhasil mendapatkan data sesuai pencarian!",
				newDataMovie,
				pageInfo
			);
		} catch (error) {
			return helperWrapper.response(
				response,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	getMovieByID: async (request, response) => {
		try {
			const { id } = request.params;
			const results = await movieModel.getMovieId(id);

			// PROSES MENYIMPAN DATA KE REDIS
			redis.setex(`getMovie:${id}`, 3600, JSON.stringify(results));

			let newDataMovie = [];
			for (const data in results) {
				const setNewData = {
					...results[data],
					releaseDate: moment().format("LL"),
				};
				newDataMovie.push(setNewData);
			}
			if (results.length < 1) {
				return helperWrapper.response(
					response,
					404,
					`Movie ID ${id} tidak ditemukan!`,
					null
				);
			} else {
				return helperWrapper.response(
					response,
					200,
					`Berhasil mendapatkan movie id!`,
					newDataMovie
				);
			}
		} catch (error) {
			return helperWrapper.response(
				response,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	postMovie: async (request, response) => {
		try {
			const {
				title,
				category,
				releaseDate,
				durationHour,
				durationMinute,
				directedBy,
				casts,
				synopsis,
			} = request.body;
			const setData = {
				title,
				category,
				releaseDate,
				durationHour,
				durationMinute,
				directedBy,
				casts,
				synopsis,
				image: request.file ? request.file.filename : null,
			};
			const results = await movieModel.postMovie(setData);

			return helperWrapper.response(
				response,
				201,
				`Berhasil menambahkan data movie!`,
				results
			);
		} catch (error) {
			return helperWrapper.response(
				response,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	updateMovie: async (request, response) => {
		try {
			const { id } = request.params;
			const checkId = await movieModel.getMovieId(id);
			if (checkId.length < 1) {
				return helperWrapper.response(
					response,
					404,
					`Movie ID ${id} tidak ditemukan!`,
					null
				);
			}

			const body = request.body;
			const newImage = request.file;
			const setData = {
				...body,
				image: request.file ? newImage.filename : checkId[0].image,
				updatedAt: new Date(Date.now()),
			};
			const result = await movieModel.updateMovie(setData, id);
			if (newImage) {
				// jika upload image
				// proses delete image
				deleteFile(`public/uploads/movie/${checkId[0].image}`);
				return helperWrapper.response(
					response,
					200,
					"Berhasil mengubah data movie!",
					result
				);
			} else {
				// tidak upload gambar
				return helperWrapper.response(
					response,
					200,
					"Berhasil mengubah data movie!",
					result
				);
			}
		} catch (error) {
			return helperWrapper.response(
				response,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	deleteMovie: async (request, response) => {
		try {
			const { id } = request.params;
			const checkId = await movieModel.getMovieId(id);
			if (checkId.length < 1) {
				return helperWrapper.response(
					response,
					404,
					`Movie ID ${id} tidak ditemukan!`,
					null
				);
			}
			const result = await movieModel.deleteMovie(id);
			if (existsSync(`${checkId[0].image}`)) {
				deleteFile(`public/uploads/movie/${checkId[0].image}`);
				return helperWrapper.response(
					response,
					200,
					`Berhasil menghapus movie!`,
					result
				);
			} else {
				return helperWrapper.response(
					response,
					200,
					`Berhasil menghapus movie!`,
					result
				);
			}
		} catch (error) {
			return helperWrapper.response(
				response,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	getMovieUpcomming: async (request, response) => {
		try {
			const { date } = request.query;
			const upcommingMovies = await movieModel.upcommingMovie(date);
			if (upcommingMovies.length < 1) {
				return helperWrapper.response(response, 404, "Movie not found!", null);
			}
			return helperWrapper.response(
				response,
				200,
				"Success Get data upcomming movie!",
				upcommingMovies
			);
		} catch (error) {
			return helperWrapper.response(
				response,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
};
