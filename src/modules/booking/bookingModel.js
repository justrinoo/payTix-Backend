const connection = require("../../config/mysql");
module.exports = {
	listBooking: (bookingId) =>
		new Promise((resolve, reject) => {
			connection.query(
				`SELECT id, userId,bookingId,dateBooking,timeBooking,totalTicket,totalPayment,paymentMethod,statusPayment, seat,dateSchedule,timeSchedule  FROM booking JOIN seatBooking ON booking.id=seatBooking.bookingId WHERE booking.id = ${bookingId}`,
				//SELECT id, userId, dateBooking,timeBooking,totalTicket,totalPayment,paymentMethod,statusPayment,seat FROM booking JOIN seatbooking ON booking.id = seatbooking.bookingId WHERE booking.id = 3
				[bookingId],
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	detailBookingById: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT * FROM booking WHERE id = ?",
				id,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	detailBookingId: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT booking.id,booking.movieId,booking.scheduleId,booking.dateBooking,booking.timeBooking,booking.totalTicket,booking.totalPayment,booking.paymentMethod,booking.statusPayment,seatbooking.seat FROM booking JOIN seatbooking ON booking.id = seatbooking.bookingId WHERE booking.id = ?", // disni join seatBooking
				id,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	detailBookingUserId: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT booking.id, booking.userId,booking.dateBooking,booking.timeBooking,booking.movieId,booking.scheduleId,booking.totalTicket,booking.totalPayment,booking.paymentMethod,booking.statusPayment,seatBooking.seat FROM booking JOIN seatBooking ON booking.id=seatBooking.bookingId WHERE booking.userId = ?",
				id,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	listSeatBooking: (scheduleId, movieId, dateBooking, timeBooking) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT id_seatBooking, seat FROM seatBooking WHERE scheduleId = ? AND movieId = ? AND dateSchedule = ? AND timeSchedule = ?",
				[scheduleId, movieId, dateBooking, timeBooking],
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	createBooking: (id, posts) =>
		new Promise((resolve, reject) => {
			connection.query("INSERT INTO booking SET ?", posts, (error) => {
				if (!error) {
					const newResultsPost = {
						...posts,
					};
					resolve(newResultsPost);
				} else {
					reject(reject(new Error(`Message : ${error.message}`)));
				}
			});
		}),
	createSeat: (data) =>
		new Promise((resolve, reject) => {
			connection.query(
				"INSERT INTO seatBooking SET ?",
				data,
				(error, results) => {
					if (!error) {
						const newSeat = {
							id_seatBooking: results.insertId,
							...data,
						};
						resolve(newSeat);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	updateBooking: (data, id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"UPDATE booking SET ? WHERE id = ?",
				[data, id],
				(error) => {
					const dataId = parseInt(id);
					if (!error) {
						const newDataUpdate = {
							id: dataId,
							...data,
						};
						resolve(newDataUpdate);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	deleteBooking: (id) =>
		new Promise((resolve, reject) => {
			connection.query("DELETE FROM booking WHERE id = ?", id, (error) => {
				if (!error) {
					resolve(id);
				} else {
					reject(new Error(`Message : ${error.message}`));
				}
			});
		}),
	ticketAlready: (statusTicket, id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"UPDATE booking SET statusUsed = ? WHERE id = ?",
				[statusTicket, id],
				(error) => {
					if (!error) {
						const setNewData = {
							id,
							statusTicket,
						};
						resolve(setNewData);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	updateTransactionMidtrans: (paymentMethod, statusPayment, id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"UPDATE booking SET paymentMethod = ?, statusPayment = ? WHERE id = ?",
				[paymentMethod, statusPayment, id],
				(error) => {
					if (!error) {
						const newDataTransactions = {
							id,
							paymentMethod,
							statusPayment,
						};
						resolve(newDataTransactions);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
	getExportTicketByIdBooking: (id) =>
		new Promise((resolve, reject) => {
			connection.query(
				"SELECT userId,bookingId,dateBooking,timeBooking,totalTicket,totalPayment,paymentMethod,statusPayment, seat,dateSchedule,timeSchedule, title  FROM booking JOIN seatBooking ON booking.id=seatBooking.bookingId JOIN movie ON movie.id=booking.movieId WHERE booking.id = ?",
				id,
				(error, results) => {
					if (!error) {
						resolve(results);
					} else {
						reject(new Error(`Message : ${error.message}`));
					}
				}
			);
		}),
};
