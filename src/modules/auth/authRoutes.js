const express = require("express");

const Router = express.Router();
const authController = require("./authController");
const middlewareUpload = require("../../middleware/uploadUser");
const middlewareAuth = require("../../middleware/auth");
// HANDLE ONLY USER!
Router.post("/register", middlewareUpload, authController.register);
Router.get("/activate/:id", authController.verivEmail);
Router.post("/login", authController.login);
Router.patch(
	"/update-password",
	middlewareAuth.authentication,
	authController.updatePassword
);
Router.post("/logout", authController.logout);

module.exports = Router;
