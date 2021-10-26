const helperResponse = require("../../helpers/wrapper");
const userModel = require("./userModel");
const moment = require("moment");
const fs = require("fs");
const redis = require("../../config/redis");
const deleteFile = require("../../helpers/uploads/deleteFile");
const jwt = require("jsonwebtoken");
const { emailServiceTransport } = require("../../helpers/email/sendEmail");
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
			const user = await userModel.getUserById(userId);
			const setBody = {
				...body,
				image: request.file ? request.file.filename : user[0].image,
			};
			if (user[0].id !== userId) {
				return helperResponse.response(response, 404, "user not found!", null);
			}
			// proses update profile
			// const dataEmail = setBody.email;
			// const token = jwt.sign({ dataEmail }, "RAHASIA", {
			// 	expiresIn: process.env.JWT_EXPIRED_ACTIVATE_EMAIL,
			// });
			// const setDataEmail = {
			// 	to: setBody.email,
			// 	subject: "Email Verification",
			// 	template: "index",
			// 	data: {
			// 		firstname: "Rino",
			// 		callbackEndPoint: `${process.env.BASE_URL_ACTIVATE_EMAIL}/${token}/${userId}`,
			// 	},
			// };
			// await emailServiceTransport(setDataEmail);
			const newDataProfile = await userModel.updateProfile(setBody, userId);
			if (user[0].image === null) {
				return helperResponse.response(
					response,
					200,
					"Success Update Profile!",
					newDataProfile
				);
			} else {
				if (user[0].phoneNumber === newDataProfile.phoneNumber) {
					deleteFile(`public/uploads/user/${user[0].image}`);
					return helperResponse.response(
						response,
						409,
						"phone number already in use!",
						null
					);
				} else {
					if (request.file && fs.existsSync(`${user[0].image}`)) {
						deleteFile(`public/uploads/user/${user[0].image}`);
						return helperResponse.response(
							response,
							200,
							"Success update profile!!",
							newDataProfile
						);
					} else {
						deleteFile(`public/uploads/user/${user[0].image}`);
						return helperResponse.response(
							response,
							200,
							"Success update profile!!",
							newDataProfile
						);
					}
				}
			}
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
				if (fs.existsSync(`${checkImage[0].image}`)) {
					deleteFile(`public/uploads/user/${checkImage[0].image}`);
					return helperResponse.response(
						response,
						200,
						"Success update image user",
						newImage
					);
				} else {
					// jika image di public nya itu beda sama di db
					deleteFile(`public/uploads/user/${checkImage[0].image}`);
					return helperResponse.response(
						response,
						200,
						"Success update image user",
						newImage
					);
				}
			}
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
	refreshToken: async (request, response) => {
		// try {
		// Generate Token ke redis
		// 	const refreshToken = request.body.refreshToken;
		// 	redis.get(`refreshToken:${refreshToken}`, (error, results) => {
		// 		// proses token bisa digunakan atau tidak
		// 		// datanya ada di redis
		// 		if (!error && results !== null) {
		// 			return helperResponse.response(
		// 				response,
		// 				403,
		// 				"Anda tidak dapat menggunakan token lagi!"
		// 			);
		// 		}
		// 		jwt.verify(
		// 			refreshToken,
		// 			process.env.REFRESH_TOKEN_JWT_SECRET,
		// 			(error, dataUser) => {
		// 				if (error) {
		// 					return helperResponse.response(response, 403, error.message);
		// 				}
		// 				delete dataUser.iat;
		// 				delete dataUser.exp;
		// 				// generate new token
		// 				const token = jwt.sign({ ...dataUser }, process.env.JWT_SECRET, {
		// 					expiresIn: process.env.JWT_EXPIRED,
		// 				});
		// 				// generate new refreshToken
		// 				const newRefreshToken = jwt.sign(
		// 					{ ...dataUser },
		// 					process.env.REFRESH_TOKEN_JWT_SECRET,
		// 					{
		// 						expiresIn: process.env.REFRESH_TOKEN_EXPIRED,
		// 					}
		// 				);

		// 				// response new Token
		// 				redis.setex(
		// 					`refreshToken:${refreshToken}`,
		// 					3600 * 24,
		// 					refreshToken
		// 				);
		// 				return helperResponse.response(
		// 					response,
		// 					200,
		// 					"Success Generate New Token!",
		// 					{ token, newRefreshToken }
		// 				);
		// 			}
		// 		);
		// 	});
		// } catch (error) {
		// 	return helperResponse.response(
		// 		response,
		// 		400,
		// 		`Bad Request : ${error.message}`
		// 	);
		// }

		// Generate token ke database
		try {
			const refreshToken = request.body.refreshToken;
			const payload = jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_JWT_SECRET
			);
			delete payload.iat;
			delete payload.exp;

			const dataToken = await userModel.getToken();
			dataToken.filter(async (data) => {
				if (data.userId === payload.id && data.refreshToken === refreshToken) {
					// generate token baru
					// token baru
					const newToken = jwt.sign({ ...payload }, process.env.JWT_SECRET, {
						expiresIn: process.env.JWT_EXPIRED,
					});
					// refreshToken baru
					const newRefreshToken = jwt.sign(
						{ ...payload },
						process.env.REFRESH_TOKEN_JWT_SECRET,
						{ expiresIn: process.env.REFRESH_TOKEN_EXPIRED }
					);
					const oldDataToken = await userModel.updateToken(
						newRefreshToken,
						data.userId
					);
					if (oldDataToken.refreshToken !== refreshToken) {
						return helperResponse.response(
							response,
							200,
							"Berhasil generate token baru!",
							{ token: newToken, refreshToken: newRefreshToken }
						);
					}
				} else {
					return helperResponse.response(
						response,
						403,
						"Anda tidak dapat menggunakan token lagi!"
					);
				}
			});
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`
			);
		}
	},
};
