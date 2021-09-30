const express = require("express");
const Router = express.Router();
const userController = require("./usersController");
const middlewareAuth = require("../../middleware/auth");

Router.get(
	"/dashboard",
	middlewareAuth.authentication,
	middlewareAuth.isAdmin,
	userController.getDashboard
);
Router.get(
	"/:id",
	middlewareAuth.authentication,
	userController.detailUserById
);
Router.patch(
	"/update-profile",
	middlewareAuth.authentication,
	userController.updateProfile
);

module.exports = Router;
