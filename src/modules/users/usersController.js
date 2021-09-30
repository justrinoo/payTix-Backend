const helperResponse = require("../../helpers/wrapper");
const userModel = require("./userModel");
const moment = require("moment");
const fs = require("fs");
const deleteFileUser = require("../../helpers/uploads/deleteFileUser");
module.exports = {
	detailUserById: async (request, response) => {
		try {
			const userId = request.decodeToken.id;
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
	updateImage: async (request, response) => {
		try {
			const userId = request.decodeToken.id;
			if (request.file === undefined) {
				return helperResponse.response(
					response,
					400,
					"please input your image...",
					null
				);
			}
			if (userId.length < 1) {
				return helperResponse.response(response, 404, "user not found!", null);
			}
			const checkImage = await userModel.getUserById(userId);

			// proses update image
			const setDataImage = request.file
				? request.file.filename
				: checkImage[0].image;

			const newImage = await userModel.updateImage(setDataImage, userId);
			// jika user default imagenya null
			if (checkImage[0].image === null) {
				return helperResponse.response(
					response,
					200,
					"Success update image user",
					newImage
				);
			} else {
				// jika image di public sama di db itu sama
				if (fs.existsSync(`public/uploads/user/${checkImage[0].image}`)) {
					deleteFileUser(`public/uploads/user/${checkImage[0].image}`);
					return helperResponse.response(
						response,
						200,
						"Success update image user",
						newImage
					);
				} else {
					// jika image di public nya itu beda sama di db
					deleteFileUser(`public/uploads/user/${checkImage[0].image}`);
					return helperResponse.response(
						response,
						200,
						"Success update image user",
						newImage
					);
				}
			}

			// const newImage = await userModel.updateImage(dataImage, userId);
			// return helperResponse.response(
			// 	response,
			// 	200,
			// 	"Success update image user",
			// 	newImage
			// );
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
