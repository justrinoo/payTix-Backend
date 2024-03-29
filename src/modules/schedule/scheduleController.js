const scheduleModel = require("./scheduleModel");
const helperResponse = require("../../helpers/wrapper");
const redis = require("../../config/redis");
const moment = require("moment");
module.exports = {
	getAllSchedule: async (request, response) => {
		try {
			let {
				page,
				limit,
				searchMovieId,
				searchLocation,
				sort = "ASC",
			} = request.query;
			page = page > 0 ? Number(page) : 1;
			limit = limit > 0 ? Number(limit) : 10;
			sort = sort === "" ? "ASC" : sort;
			searchMovieId = searchMovieId ? searchMovieId : "";
			searchLocation = searchLocation ? searchLocation : "";
			const offset = page * limit - limit;
			const totalData = await scheduleModel.totalDataSchedule(
				searchMovieId,
				searchLocation
			);
			let totalPage = Math.ceil(totalData / limit);
			const results = await scheduleModel.getScheduleSearch(
				searchMovieId,
				searchLocation,
				limit,
				offset,
				sort
			);
			// console.log(results);
			const pageInfo = {
				page: results.length < 1 ? 1 : page,
				totalPage,
				limit: results.length < 1 ? 10 : limit,
				totalData,
			};
			const allschedule = await scheduleModel.getAllSchedule();

			if (results.length < 1) {
				if (searchLocation === undefined && searchMovieId === undefined) {
					let newAllSchedule = [];
					for (const data in allschedule) {
						setData = {
							...allschedule[data],
							time: allschedule[data].time.split(","),
						};
						newAllSchedule.push(setData);
					}
					redis.setex(
						`getSchedule:all`,
						3600,
						JSON.stringify({ newAllSchedule, pageInfo })
					);
					return helperResponse.response(
						response,
						200,
						"Berhasil mendapatkan semua data!",
						newAllSchedule,
						pageInfo
					);
				} else {
					return helperResponse.response(
						response,
						404,
						"Schedule tidak ditemukan!"
					);
				}
			}
			let newDataSchedule = [];
			for (const data in results) {
				const setNewData = {
					...results[data],
					time: results[data].time.split(","),
				};
				newDataSchedule.push(setNewData);
			}

			redis.setex(
				`getSchedule:${JSON.stringify(request.query)}`,
				3600,
				JSON.stringify({ newDataSchedule, pageInfo })
			);

			return helperResponse.response(
				response,
				200,
				"Berhasil mendapatkan data sesuai pencarian!",
				newDataSchedule,
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
				time: time.split(" ").join(""),
			};
			const results = await scheduleModel.createSchedule(dataSchedule);
			console.log(results);
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
	getScheduleFilterByDateStartEnd: async (request, response) => {
		try {
			const { dateStart, dateEnd } = request.query;
			let schedules = await scheduleModel.getScheduleByDateStartAndEnd(
				dateStart,
				dateEnd
			);
			const newDataSchedule = [];
			schedules.map((value) => {
				const setNewValue = {
					...value,
					time: value.time.split(","),
					dateStart: moment(value.dateStart).format("YYYY-MM-DD"),
					dateEnd: moment(value.dateEnd).format("YYYY-MM-DD"),
				};
				newDataSchedule.push(setNewValue);
			});
			if (newDataSchedule.length < 1) {
				return helperResponse.response(
					response,
					404,
					"Schedule not found!",
					null
				);
			}
			return helperResponse.response(
				response,
				200,
				"Success Get Data By Date Start and Date End!",
				newDataSchedule
			);
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request ${error.message}`
			);
		}
	},
};
