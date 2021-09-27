const scheduleModel = require("./scheduleModel");
const helperResponse = require("../../helpers/wrapper");
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
			const allSchedule = await scheduleModel.getAllSchedule();
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
			const totalData = await scheduleModel.totalDataSchedule();
			const totalPage = Math.ceil(totalData / limit);

			const results = await scheduleModel.getScheduleSearch(
				searchMovieId,
				searchLocation,
				limit,
				offset,
				sort
			);

			let pageInfo = {
				page,
				totalPage,
				limit,
				totalData,
			};
			if (searchLocation === "") {
				searchLocation = helperResponse.response(
					response,
					200,
					"Berhasil mendapatkan semua data!",
					allSchedule,
					pageInfo
				);
				return;
			} else {
				searchLocation;
			}

			if (searchMovieId === "") {
				searchMovieId = helperResponse.response(
					response,
					404,
					"Berhasil mendapatkan semua data!",
					allSchedule
				);
				return;
			} else {
				searchMovieId;
			}

			if (results.length < 1) {
				return helperResponse.response(
					response,
					200,
					"Berhasil mendapatkan semua data!",
					allSchedule
				);
			} else {
				return helperResponse.response(
					response,
					200,
					`Berhasil mendapatkan data berdasarkan pencarian!`,
					results,
					pageInfo
				);
			}
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
				time: time.split(" ").join(""),
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
