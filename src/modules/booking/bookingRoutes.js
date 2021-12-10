const express = require("express");
const Router = express.Router();
const bookingControlller = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");
// HANDLING USER ONLY!
Router.get(
	"/booking-id/:id",
	middlewareAuth.authentication,
	middlewareAuth.isUser,
	bookingControlller.detailByBookingId
);

Router.get(
	"/export-ticket/:id",
	middlewareAuth.authentication,
	middlewareAuth.isUser,
	bookingControlller.exportTicketUserBooking
);

Router.get("/used-ticket/:id", bookingControlller.ticketAlreadyUsed);
Router.get(
	"/user-id",
	middlewareAuth.authentication,
	middlewareAuth.isUser,
	bookingControlller.detailByUserId
);
Router.get(
	"/seat",
	middlewareAuth.authentication,
	middlewareAuth.isUser,
	bookingControlller.detailSeatBooking
);

Router.post(
	"/create",
	middlewareAuth.authentication,
	middlewareAuth.isUser,
	bookingControlller.createPostBooking
);

Router.post("/midtrans-noitification", bookingControlller.notificationMidtrans);
module.exports = Router;
