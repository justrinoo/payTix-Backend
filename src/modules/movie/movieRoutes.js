const express = require("express");
const Router = express.Router();
const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
const middlewareUpload = require("../../middleware/uploadMovie");
Router.get(
	"/",
	// middlewareAuth.authentication,
	// middlewareRedis.getMovieRedis,
	movieController.getAllMovie
); // user & admin

Router.get("/upcomming", movieController.getMovieUpcomming);
Router.get(
	"/:id",
	middlewareAuth.authentication,
	middlewareRedis.getMovieByIdRedis,
	movieController.getMovieByID
); // user & admina
Router.post(
	"/",
	middlewareAuth.authentication,
	middlewareAuth.isAdmin,
	middlewareUpload,
	middlewareRedis.clearDataMovieRedis,
	movieController.postMovie
); // onlyAdmin
Router.patch(
	"/:id",
	middlewareAuth.authentication,
	middlewareAuth.isAdmin,
	middlewareUpload,
	movieController.updateMovie
); // onlyAdmin
Router.delete(
	"/:id",
	middlewareAuth.authentication,
	middlewareRedis.clearDataMovieRedis,
	middlewareAuth.isAdmin,
	movieController.deleteMovie
); // onlyAdmin

module.exports = Router;
