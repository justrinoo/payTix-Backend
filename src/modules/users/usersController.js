const helperResponse = require("../../helpers/wrapper");
const userModel = require("./userModel");
const moment = require("moment");
module.exports = {
	detailUserById: async (request, response) => {
		try {
			const userId = request.params.id;
			const user = await userModel.getUserById(userId);
			if (user.length < 1) {
				return helperResponse.response(response, 404, "user not found!", null);
			}
			return helperResponse.response(
				response,
				200,
				"success get user by id!",
				user
			);
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
	updateProfile: async (request, response) => {
		try {
			const userId = request.decodeToken.id;
			const body = request.body;
			const setBody = { ...body };
			const user = await userModel.getUserById(userId);
			if (user.length < 1) {
				return helperResponse.response(response, 404, "user not found!", null);
			}
			// proses update profile
			const newDataProfile = await userModel.updateProfile(setBody, userId);
			if (user[0].email === newDataProfile.email) {
				return helperResponse.response(
					response,
					409,
					"email already exist!",
					null
				);
			}
			if (user[0].phoneNumber === newDataProfile.phoneNumber) {
				return helperResponse.response(
					response,
					409,
					"phone number already in use!",
					null
				);
			}
			return helperResponse.response(
				response,
				200,
				"Success Update Profile!",
				newDataProfile
			);
		} catch (error) {
			return helperResponse.response(
				response,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
	getDashboard: async (request, response) => {
		try {
			const { movieId, location, premier } = request.query;
			const users = await userModel.dashboard(movieId, location, premier);

			const newUsers = [];
			users.forEach((value) => {
				const newDataUsers = {
					...value,
					month: moment().format("MMM"),
				};
				newUsers.push(newDataUsers);
			});
			if (newUsers.length < 1) {
				return helperResponse.response(
					response,
					404,
					"data tidak ditemukan!",
					null
				);
			}
			return helperResponse.response(
				response,
				200,
				"Success Get data Dashboard",
				newUsers
			);
		} catch (error) {
			return helperResponse.response(
				response,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
};
