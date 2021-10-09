const helperResponse = require("../../helpers/wrapper");
const bookingModel = require("./bookingModel");
const { transactions, notification } = require("../../helpers/midtrans");
const { v4: uuid } = require("uuid");
const htmlPdf = require("html-pdf");
const ejs = require("ejs");
const path = require("path");
const moment = require("moment");
module.exports = {
	detailByBookingId: async function (request, response) {
		try {
			const id = request.params.id;
			const dataBooking = await bookingModel.detailBookingId(id);
			// ambil data seat dan gabungkan ke array
			// buat ambil seat
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
			const { id } = request.decodeToken;
			const checkUserId = await bookingModel.detailBookingUserId(id);
			if (checkUserId.length < 1) {
				return helperResponse.response(
					response,
					404,
					`maaf data dengan id : ${id}, belum melakukan booking!`,
					null
				);
			}
			const newDataUserId = [];
			checkUserId.forEach((newData) => {
				let filterBy = newDataUserId.filter((value) => {
					return value.id === newData.id;
				});
				if (filterBy.length > 0) {
					// data dari filternya lebih dari 0
					let filterByIndex = newDataUserId.indexOf(filterBy[[0]]);
					newDataUserId[filterByIndex].seat = newDataUserId[
						filterByIndex
					].seat.concat(newData.seat);
				} else {
					if (typeof newData.seat === "string") {
						newData.seat = [newData.seat];
						newDataUserId.push(newData);
					}
				}
			});

			return helperResponse.response(
				response,
				200,
				"Data Booking Berdasarkan User, ditemukan!",
				newDataUserId
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
			const user_id = request.decodeToken.id;
			const {
				movieId,
				scheduleId,
				dateBooking,
				timeBooking,
				seat: totalTicket,
			} = request.body;
			const setDataPostBooking = {
				id: uuid(),
				userId: user_id,
				movieId,
				scheduleId,
				dateBooking,
				timeBooking,
				totalTicket,
				totalPayment: (totalPayment = 10 * totalTicket.length),
				statusPayment: "Pending",
			};
			const newDataPostBooking = {
				...setDataPostBooking,
				totalTicket: totalTicket.length,
			};

			const resultPostBooking = await bookingModel.createBooking(
				newDataPostBooking.id,
				newDataPostBooking
			);

			const dataListSeat = { ...resultPostBooking };
			const id_booking = dataListSeat.id;

			const transaction = await transactions(
				id_booking,
				resultPostBooking.totalPayment
			);
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

			helperResponse.response(response, 201, "Booking berhasil dibuat!", {
				results,
				redirect_url: transaction,
			});
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

			const checkBookingId = await bookingModel.detailBookingId(id);
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
			const bookingId = await bookingModel.detailBookingId(id);
			if (bookingId.length < 1) {
				return helperResponse.response(
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
	ticketAlreadyUsed: async (request, response) => {
		try {
			const bookingId = request.params.id;
			const checkBooking = await bookingModel.detailBookingById(bookingId);
			if (checkBooking.length < 1) {
				return helperResponse.response(
					response,
					404,
					"Booking not found!",
					null
				);
			}

			let userUsedTicket = "alreadyUsed";
			const newDataTicket = await bookingModel.ticketAlready(
				userUsedTicket,
				bookingId
			);
			if (checkBooking[0].statusUsed === "active") {
				return helperResponse.response(
					response,
					200,
					"Success Change status, Ticket has been already used!",
					newDataTicket
				);
			} else {
				return helperResponse.response(
					response,
					409,
					"Ticket sudah terpakai!",
					checkBooking
				);
			}
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`
			);
		}
	},
	exportTicketUserBooking: async function (request, response) {
		try {
			const { id } = request.params;
			const fileName = `ticket-${id}.pdf`;
			const userBooking = await bookingModel.getExportTicketByIdBooking(id);
			// join seat => ['A1', 'A2', 'A3']

			const seatBooking = userBooking.map((value) => value.seat);
			let newData = [];
			userBooking.map((value) => {
				const setNewData = {
					...value,
				};
				newData.push(setNewData);
			});
			const newDataBooking = newData[0];

			const newDataBookingTicket = {
				...newDataBooking,
				dateBooking: moment().format("DD MMM"),
				timeBooking: moment().format("LT"),
				seat: seatBooking,
				linkTicket: `http://${request.get("host")}/booking/used-ticket/${
					newDataBooking.bookingId
				}`,
			};
			ejs.renderFile(
				path.resolve("./src/templates/pdf/index.ejs"),
				{ newDataBookingTicket },
				(error, results) => {
					if (!error) {
						let options = {
							height: "11.25in",
							width: "10.5in",
						};
						htmlPdf
							.create(results, options)
							.toFile(
								path.resolve(`./public/generate/${fileName}`),
								(error, results) => {
									if (error) {
										return helperResponse.response(
											response,
											400,
											error.message
										);
									}
									return helperResponse.response(
										response,
										200,
										"Success Generate Ticket!",
										{
											file_ticket: `http://${request.get(
												"host"
											)}/generate/${fileName}`,
										}
									);
								}
							);
					}
				}
			);
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`
			);
		}
	},
	notificationMidtrans: async function (request, response) {
		try {
			console.log("NOTIF MIDTRANS IS RUNNING!");
			const requestMidtrans = request.body;
			const dataTransaction = await notification(requestMidtrans);
			return helperResponse.response(
				response,
				200,
				"Success Finish Transactions!",
				dataTransaction
			);
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`
			);
		}
	},
};
