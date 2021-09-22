const express = require("express");
const Router = express.Router();
const movieRoutes = require("../modules/movie/movieRoutes");
const scheduleRoutes = require("../modules/schedule/scheduleRoutes");

Router.use("/movie", movieRoutes);
Router.use("/schedule", scheduleRoutes);

module.exports = Router;
