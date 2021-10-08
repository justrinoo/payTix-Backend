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
	"/export-ticket/:id",
	middlewareAuth.isUser,
	bookingControlller.exportTicketUserBooking
);

Router.get(
	"/used-ticket/:id",
	middlewareAuth.isAdmin,
	bookingControlller.ticketAlreadyUsed
);
Router.get(
	"/user-id",
	middlewareAuth.isUser,
	bookingControlller.detailByUserId
);
Router.get(
	"/seat",
	middlewareAuth.isUser,
	bookingControlller.detailSeatBooking
);

Router.post(
	"/create",
	middlewareAuth.isUser,
	bookingControlller.createPostBooking
);

Router.post(
	"/midtrans-noitification",
	middlewareAuth.authentication,
	bookingControlller.notificationMidtrans
);
module.exports = Router;
