require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const compression = require("compression");
const routerNavigation = require("./routes");
const bodyParser = require("body-parser");
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());
app.use(xss());
app.use(helmet());
app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3001;

app.use("/", routerNavigation);
app.use("*", (request, response) => {
	response.status(404).send("Path not found!");
});

app.listen(port, () => console.log(`Express app at listen on port ${port} !`));
