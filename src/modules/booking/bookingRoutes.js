const express = require("express");
const Router = express.Router();
const bookingControlller = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");
// HANDLING USER ONLY!
Router.get(
	"/booking-id/:id",
	middlewareAuth.isUser,
	bookingControlller.detailByBookingId
);
Router.get(
	"/used-ticket/:id",
	middlewareAuth.isAdmin,
	bookingControlller.ticketAlreadyUsed
);
Router.get(
	"/user-id/:id",
	middlewareAuth.isUser,
	bookingControlller.detailByUserId
);
Router.get(
	"/seat",
	middlewareAuth.isUser,
	bookingControlller.detailSeatBooking
);
Router.get(
	"/export-ticket/:id",
	middlewareAuth.authentication,
	bookingControlller.exportTicket
);
Router.post(
	"/create",
	middlewareAuth.isUser,
	bookingControlller.createPostBooking
);

module.exports = Router;
