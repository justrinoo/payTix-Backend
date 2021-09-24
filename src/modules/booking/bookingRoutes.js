const express = require("express");
const Router = express.Router();
const bookingControlller = require("./bookingController");

// Router.get("/", bookingControlller.getListBooking);
Router.get("/booking-id/:id", bookingControlller.detailByBookingId);
Router.get("/user-id/:id", bookingControlller.detailByUserId);
Router.post("/create", bookingControlller.createPostBooking);
Router.patch("/update/:id", bookingControlller.updateBooking);
Router.delete("/delete/:id", bookingControlller.deleteBooking);

module.exports = Router;
