const scheduleModel = require("./scheduleModel");
const helperResponse = require("../../helpers/wrapper");
module.exports = {
	getAllSchedule: async (request, response) => {
		try {
			/**
			 * Default Value
			 * - page = 1
			 * - limit = 10
			 * - sort => ASC / DESC
			 * - search => name
			 * - sortField => nameField
			 */
			let { searchLocation, searchMoveId, page, limit } = request.query;
			page = page > 0 ? Number(page) : 1;
			limit = limit > 0 ? Number(limit) : 10;
			searchLocation = searchLocation === "" ? "null" : searchLocation;
			searchMoveId = searchMoveId === "" ? "null" : searchMoveId;
			console.log(searchLocation);
			// searchMoveId !== "" ? 1 : searchMoveId;
			const offset = page * limit - limit;
			const totalData = await scheduleModel.totalDataSchedule();
			const totalPage = Math.ceil(totalData / limit);
			const results = await scheduleModel.getAllSchedule(
				searchLocation,
				limit,
				offset
			);
			// const resultMovieId = await scheduleModel.getScheduleByMovieId(
			// 	searchMoveId,
			// 	limit,
			// 	offset
			// );

			let pageInfo = {
				page,
				totalPage,
				limit,
				totalData,
			};

			// if (searchLocation) {
			// const checkDataLocations =
			// 	resultsLocation.length < 1 ? null : resultsLocation;
			// const checkMessage =
			// 	resultsLocation.length < 1
			// 		? "data tidak ditemukan!"
			// 		: "Berhasil mendapatkan data!";
			// let PageInfoNull = {
			// 	page,
			// 	totalPage,
			// 	limit,
			// 	totalData: 0,
			// };
			// const checkPageInfo =
			// 	resultsLocation.length < 1 ? PageInfoNull : pageInfo;
			// const checkStatusCode = resultsLocation.length < 1 ? 404 : 200;
			return helperResponse.response(
				response,
				200,
				`Berhasil mendapatkan data!`,
				results,
				pageInfo
			);
			// } else if (searchMoveId) {
			// 	const checkDataMovieId =
			// 		resultMovieId.length < 1 ? null : resultMovieId;
			// 	const checkMessage =
			// 		resultMovieId.length < 1
			// 			? "data tidak ditemukan!"
			// 			: "Berhasil mendapatkan data!";
			// 	let PageInfoNull = {
			// 		page,
			// 		totalPage,
			// 		limit,
			// 		totalData: 0,
			// 	};
			// 	const checkPageInfo =
			// 		resultMovieId.length < 1 ? PageInfoNull : pageInfo;
			// 	const checkStatusCode = resultMovieId.length < 1 ? 404 : 200;
			// 	return helperResponse.response(
			// 		response,
			// 		checkStatusCode,
			// 		checkMessage,
			// 		checkDataMovieId,
			// 		checkPageInfo
			// 	);
			// }
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
				time,
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
			// console.log("OKE DELETE BERJALAN...");
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
