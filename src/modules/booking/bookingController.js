const helperResponse = require("../../helpers/wrapper");
const bookingModel = require("./bookingModel");
// helperResponse.response(response, 400, `Bad Request : ${error.message}`, null);
module.exports = {
	getListBooking: async function (request, response) {
		try {
			// console.log("Booking Ready Use!");
			// UBAH KE PARAMETERRR!!!!!
			let { IdBooking, IdUser } = request.query;
			IdBooking = IdBooking === "" ? 0 : IdBooking;
			IdUser = IdUser === "" ? 0 : IdUser;
			const listBooking = await bookingModel.listBooking(IdBooking, IdUser);
			if (listBooking.length === 0) {
				return helperResponse.response(
					response,
					404,
					"Booking tidak ditemukan!",
					null
				);
			}
			if (IdBooking === 0 && IdUser === 0) {
				return helperResponse.response(
					response,
					404,
					"Booking tidak ditemukan!",
					null
				);
			} else {
				return helperResponse.response(
					response,
					200,
					"Berhasil mendapatkan data booking!",
					listBooking
				);
			}
		} catch (error) {
			// response.status(500).send(error.message);
			helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
	detailByBookingId: async function (request, response) {
		try {
			const id = request.params.id;
			const dataBooking = await bookingModel.detailBookingId(id);
			// ambil data seat dan gabungkan ke array
			const dataSeat = [];
			dataBooking.forEach((value) => {
				const data = value.seat;
				dataSeat.push(data);
				return data;
			});
			const dataNewBookingLoop = dataBooking.map((value) => {
				const data = value;
				return data;
			});
			const dataNewBooking = dataNewBookingLoop[0];

			const newDataDetailBooking = {
				...dataNewBooking,
				seat: dataSeat,
			};

			//const newResult = [];
			// result.forEach((element) => {
			// 	const setData = {
			// 		...element,
			// 		seat: [element.seat],
			// 	};
			// 	const checkData = newResult.find((value) => value.id === setData.id);
			// 	if (!checkData) {
			// 		newResult.push(setData);
			// 	} else {
			// 		checkData.seat.push(setData.seat[0]);
			// 	}
			// });

			// for (const value of dataBooking) {
			// 	console.log(value.id);
			// 	// value.skill = await movieModel.getSkillByUserId(value.user_id);
			// 	value.seat = [{ seat: "A1" }, { seat: "A2" }, { seat: "A3" }];
			// }
			// console.log(req.query)

			if (dataBooking.length < 1) {
				return helperResponse.response(
					response,
					404,
					`Maaf data booking dengan id : ${id} tidak ditemukan!`,
					null
				);
			}
			return helperResponse.response(
				response,
				200,
				"Data booking berhasil ditemukan!",
				newDataDetailBooking
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
	detailByUserId: async function (request, response) {
		try {
			const { id } = request.params;
			const checkUserId = await bookingModel.detailBookingUserId(id);
			if (checkUserId.length < 1) {
				return helperResponse.response(
					response,
					404,
					`maaf data dengan id : ${id}, tidak ditemukan!`,
					null
				);
			}
			// console.log(`Data Awal => `, checkUserId);
			// PROSES PECAH ID
			let newData = [];
			let uniqData = {};
			let dataSeat = [];
			for (let i in checkUserId) {
				propId = checkUserId[i]["id"];
				propSeat = checkUserId[i]["seat"];
				uniqData[propId] = checkUserId[i];
				dataSeat.push(propSeat);
			}

			for (let newDataUserById in uniqData) {
				const newDataUserDataById = {
					...uniqData[newDataUserById],
					seat: dataSeat,
				};
				newData.push(newDataUserDataById);
			}
			return helperResponse.response(
				response,
				200,
				"Data Booking Berdasarkan User, ditemukan!",
				newData
			);
		} catch (error) {
			helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
	detailSeatBooking: async function (request, response) {
		try {
			const { scheduleId, movieId, dateBooking, timeBooking } = request.query;
			const resultsSeat = await bookingModel.listSeatBooking(
				scheduleId,
				movieId,
				dateBooking,
				timeBooking
			);
			if (resultsSeat.length < 1) {
				return helperResponse.response(
					response,
					404,
					"data seat booking tidak ditemukan!",
					null
				);
			}
			return helperResponse.response(
				response,
				200,
				"Data seat booking berhasil didapatkan!",
				resultsSeat
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
	createPostBooking: async function (request, response) {
		try {
			// console.log(request.body);
			const {
				userId,
				movieId,
				scheduleId,
				dateBooking,
				timeBooking,
				seat: totalTicket,
				paymentMethod,
				statusPayment,
			} = request.body;
			const setDataPostBooking = {
				userId,
				movieId,
				scheduleId,
				dateBooking,
				timeBooking,
				totalTicket,
				totalPayment: (totalPayment = 10 * totalTicket.length),
				paymentMethod,
				statusPayment,
			};
			const newDataPostBooking = {
				...setDataPostBooking,
				totalTicket: totalTicket.length,
			};

			const resultPostBooking = await bookingModel.createBooking(
				newDataPostBooking
			);
			// console.log(resultPostBooking);

			const dataListSeat = { ...resultPostBooking };
			const id_booking = dataListSeat.id;

			const results = dataListSeat;
			totalTicket.forEach(async (totalTicket) => {
				let newDataSeatBooking = {
					bookingId: id_booking,
					scheduleId,
					movieId,
					dateSchedule: dateBooking,
					timeSchedule: timeBooking,
					seat: totalTicket,
				};
				await bookingModel.createSeat(newDataSeatBooking);
			});

			// REFACTOR DATA BOOKING

			helperResponse.response(
				response,
				201,
				"Booking berhasil dibuat!",
				results
			);
		} catch (error) {
			helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
	updateBooking: async function (request, response) {
		try {
			const { id } = request.params;
			const dataBodyUpdate = request.body;

			const checkBookingId = await bookingModel.detailBooking(id);
			if (checkBookingId.length < 1) {
				return helperResponse.response(
					response,
					404,
					"maaf data booking tidak ditemukan!",
					null
				);
			}
			const dataUpdate = {
				...dataBodyUpdate,
				totalTicket: dataBodyUpdate.seat.length,
				updatedAt: new Date(Date.now()),
			};

			delete dataUpdate.seat;
			const newData = await bookingModel.updateBooking(dataUpdate, id);
			helperResponse.response(
				response,
				200,
				"Data Booking berhasil diubah!",
				newData
			);
			// console.log("Berhasil mengubah data booking =>", test);
		} catch (error) {
			helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
	deleteBooking: async function (request, response) {
		try {
			const id = request.params.id;
			const bookingId = await bookingModel.detailBooking(id);
			if (bookingId.length < 1) {
				helperResponse.response(
					response,
					404,
					`Maaf data booking dengan id ${id}, tidak ditemukan!`,
					null
				);
			}
			const dataBooking = await bookingModel.deleteBooking(id);
			return helperResponse.response(
				response,
				200,
				"Berhasil menghapus data booking!",
				dataBooking
			);
		} catch (error) {
			helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
};
