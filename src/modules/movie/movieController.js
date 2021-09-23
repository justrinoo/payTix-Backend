const movieModel = require("./movieModel");
const helperWrapper = require("../../helpers/wrapper");
module.exports = {
	getAllMovie: async (request, response) => {
		try {
			// console.log(request.query);
			// pagination
			let { page, limit, searchName, sortName, sortDate } = request.query;
			page = page > 0 ? Number(page) : 1;
			limit = limit > 0 ? Number(limit) : 10;
			sortName = sortName === "" ? "ASC" : sortName;
			// OFFSET ?
			// page 1, limit 3 = offset 0
			// page 2, limit 3 = offset 3
			// dst ...
			const offset = page * limit - limit;
			const totalData = await movieModel.getCountMovie();

			const results = await movieModel.getAllMovie(
				searchName,
				sortName,
				sortDate,
				limit,
				offset
			);

			// console.log(newResults);
			let totalPage = Math.ceil(totalData / limit);

			const pageInfo = {
				page,
				totalPage: totalPage,
				limit,
				totalData,
			};
			return helperWrapper.response(
				response,
				200,
				"Berhasil mengambil semua data movie",
				results,
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
			if (results.length < 1) {
				return helperWrapper.response(
					response,
					404,
					`Movie ID ${id} tidak ditemukan!`,
					null
				);
			} else {
				// console.log(results);
				return helperWrapper.response(
					response,
					200,
					`Berhasil mendapatkan movie id!`,
					results
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
			// console.log(request.body);
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
			const setData = {
				...body,
				updatedAt: new Date(Date.now()),
			};
			const result = await movieModel.updateMovie(setData, id);
			return helperWrapper.response(
				response,
				200,
				"Berhasil mengubah data movie!",
				result
			);
			// console.log(result);
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
			return helperWrapper.response(
				response,
				200,
				`Berhasil menghapus movie!`,
				result
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
