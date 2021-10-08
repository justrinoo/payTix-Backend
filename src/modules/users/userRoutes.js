const express = require("express");
const Router = express.Router();
const userController = require("./usersController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadUser");
Router.get(
	"/dashboard",
	middlewareAuth.authentication,
	middlewareAuth.isAdmin,
	userController.getDashboard
);
Router.get("/", middlewareAuth.authentication, userController.detailUserById);

Router.post(
	"/refresh-token",
	middlewareAuth.authentication,
	userController.refreshToken
);

Router.patch(
	"/update-image",
	middlewareAuth.authentication,
	middlewareUpload,
	userController.updateImage
);
Router.patch(
	"/update-profile",
	middlewareAuth.authentication,
	middlewareUpload,
	userController.updateProfile
);

module.exports = Router;
