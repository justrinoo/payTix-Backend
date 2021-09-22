const express = require("express");
const Router = express.Router();
const movieController = require("./movieController");

// Router.get("/:id", movieController.getMovieByID); // dibacanya yang endpoint all
Router.get("/", movieController.getAllMovie);
Router.get("/:id", movieController.getMovieByID);
Router.post("/", movieController.postMovie);
Router.patch("/:id", movieController.updateMovie);
Router.delete("/:id", movieController.deleteMovie);

module.exports = Router;
