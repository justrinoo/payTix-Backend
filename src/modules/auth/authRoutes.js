const express = require("express");

const Router = express.Router();
const authController = require("./authController");

// HANDLE ONLY USER!
Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.patch("/update-password/:id", authController.updatePassword);
Router.post("/logout", authController.logout);

module.exports = Router;
