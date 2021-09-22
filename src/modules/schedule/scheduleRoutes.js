const express = require("express");
const Router = express.Router();
const scheduleController = require("../schedule/scheduleController");

Router.get("/", scheduleController.getAllSchedule);
Router.get("/:id", scheduleController.getDetailSchedule);
Router.post("/create", scheduleController.createSchedule);
Router.patch("/update/:id", scheduleController.updateSchedule);
Router.delete("/delete/:id", scheduleController.deleteSchedule);

module.exports = Router;
