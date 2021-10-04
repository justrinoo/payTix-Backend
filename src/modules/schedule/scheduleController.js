const scheduleModel = require("./scheduleModel");
const helperResponse = require("../../helpers/wrapper");
const redis = require("../../config/redis");
module.exports = {
	getAllSchedule: async (request, response) => {
		try {
			/**
			 * 	Default Value
			 * - page = 1
			 * - limit = 10
			 * - sort => ASC / DESC
			 * - search => name
			 * - sortField => nameField
			 */
			let {
				searchMovieId,
				searchLocation,
				page,
				limit,
				sort = "ASC",
			} = request.query;
			page = page > 0 ? Number(page) : 1;
			limit = limit > 0 ? Number(limit) : 10;
			sort = sort === "" ? "ASC" : sort;

			const offset = page * limit - limit;
			const results = await scheduleModel.getScheduleSearch(
				searchMovieId,
				searchLocation,
				limit,
				offset,
				sort
			);

			const allSchedule = await scheduleModel.getAllSchedule();
			searchMovieId = searchMovieId === "" ? allSchedule : searchMovieId;
			searchLocation = searchLocation === "" ? allSchedule : searchLocation;
			let totalData = await scheduleModel.totalDataSchedule(
				searchMovieId,
				searchLocation
			);
			let totalPage = Math.ceil(totalData / limit);
			const pageInfo = {
				page,
				totalPage,
				limit,
				totalData,
			};
			if (results.length < 1) {
				// Redis Schedule All Data
				const pageAllData = {
					page,
					totalPage: page,
					limit,
					totalData: allSchedule.length,
				};
				redis.setex(
					`getSchedule:all`,
					3600,
					JSON.stringify({ allSchedule, pageAllData })
				);
				return helperResponse.response(
					response,
					200,
					"Berhasil mendapatkan semua data",
					allSchedule,
					pageAllData
				);
			}
			redis.setex(
				`getSchedule:${JSON.stringify(request.query)}`,
				3600,
				JSON.stringify({ results, pageInfo })
			);
			return helperResponse.response(
				response,
				200,
				"berhasil mendapatkan data sesuai pencarian!",
				results,
				pageInfo
			);
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	getDetailSchedule: async (request, response) => {
		try {
			const checkId = request.params.id;
			const results = await scheduleModel.GetDetailSchedule(checkId);
			if (results.length < 1) {
				return helperResponse.response(
					response,
					404,
					`Data schedule dengan ID ${checkId}, tidak ditemukan!`,
					null
				);
			}
			const newDataSchedule = {
				...results[0],
				dateStart: results[0].dateStart.toLocaleDateString(),
				dateEnd: results[0].dateEnd.toLocaleDateString(),
			};
			redis.setex(
				`getSchedule:${checkId}`,
				3600,
				JSON.stringify(newDataSchedule)
			);
			return helperResponse.response(
				response,
				200,
				"Data schedule ditemukan!",
				newDataSchedule
			);
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	createSchedule: async (request, response) => {
		try {
			const { movie_id, price, premiere, location, dateStart, dateEnd, time } =
				request.body;
			const dataSchedule = {
				movie_id,
				price,
				premiere,
				location,
				dateStart,
				dateEnd,
				time: [time.split(" ").join("")],
			};
			const results = await scheduleModel.createSchedule(dataSchedule);
			return helperResponse.response(
				response,
				200,
				"Berhasil menambahkan schedule baru!",
				results
			);
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	updateSchedule: async (request, response) => {
		try {
			const id = request.params.id;
			const scheduleId = await scheduleModel.GetDetailSchedule(id);
			if (scheduleId.length < 1) {
				return helperResponse.response(
					response,
					404,
					`Data dengan ID ${id} tidak ditemukan!`,
					null
				);
			}
			const body = request.body;
			const dataSchedule = {
				...body,
				updatedAt: new Date(Date.now()),
			};
			const results = await scheduleModel.updateSchedule(dataSchedule, id);
			return helperResponse.response(
				response,
				200,
				"Berhasil mengubah data schedule!",
				results
			);
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request ${error.message}`,
				null
			);
		}
	},
	deleteSchedule: async (request, response) => {
		try {
			const id = request.params.id;
			const scheduleID = await scheduleModel.GetDetailSchedule(id);
			if (scheduleID.length < 1) {
				return helperResponse.response(
					response,
					404,
					`Gagal menghapus! Data dengan ID : ${id}, tidak ditemukan!`,
					null
				);
			}
			const results = await scheduleModel.deleteSchedule(id);
			return helperResponse.response(
				response,
				200,
				"Berhasil menghapus data schedule!",
				results
			);
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
};
