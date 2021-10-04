const helperResponse = require("../helpers/wrapper");
const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
module.exports = {
	authentication: (request, response, next) => {
		let token = request.headers.authorization;

		if (!token) {
			return helperResponse.response(response, 403, "Please Login First!");
		}
		token = token.split(" ")[1];

		redis.get(`accessToken:${token}`, (error, results) => {
			if (!error && results !== null) {
				return helperResponse.response(
					response,
					403,
					"Your token is destroy, please login!",
					null
				);
			}
			jwt.verify(token, process.env.JWT_SECRET, (error, results) => {
				if (error) {
					return helperResponse.response(response, 403, error.message);
				}
				request.decodeToken = results;
				next();
			});
		});
	},
	isUser: (request, response, next) => {
		const users = request.decodeToken;
		// cek role
		if (users.role !== "user") {
			return helperResponse.response(
				response,
				403,
				"You dont have permission!"
			);
		}
		next();
	},
	isAdmin: (request, response, next) => {
		const users = request.decodeToken;
		if (users.role !== "admin") {
			return helperResponse.response(
				response,
				403,
				"You dont have permission!"
			);
		}
		next();
	},
};
