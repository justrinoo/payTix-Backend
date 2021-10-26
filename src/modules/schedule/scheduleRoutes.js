const express = require("express");
const Router = express.Router();
const scheduleController = require("../schedule/scheduleController");
const authMiddleware = require("../../middleware/auth");
const redisMiddleware = require("../../middleware/redis");
Router.get(
	"/",
	authMiddleware.authentication,
	redisMiddleware.getScheduleRedis,
	scheduleController.getAllSchedule
);
Router.get(
	"/date",
	authMiddleware.authentication,
	scheduleController.getScheduleFilterByDateStartEnd
);
Router.get(
	"/:id",
	authMiddleware.authentication,
	authMiddleware.isAdmin,
	redisMiddleware.getScheduleByIdRedis,
	scheduleController.getDetailSchedule
);
Router.post(
	"/create",
	authMiddleware.authentication,
	authMiddleware.isAdmin,
	scheduleController.createSchedule
);
Router.patch(
	"/update/:id",
	authMiddleware.authentication,
	authMiddleware.isAdmin,
	redisMiddleware.clearScheduleRedis,
	scheduleController.updateSchedule
);
Router.delete(
	"/delete/:id",
	authMiddleware.authentication,
	authMiddleware.isAdmin,
	redisMiddleware.clearScheduleRedis,
	scheduleController.deleteSchedule
);

module.exports = Router;
