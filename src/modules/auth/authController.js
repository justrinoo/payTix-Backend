const helperResponse = require("../../helpers/wrapper");
const { v4: uuidv4 } = require("uuid");
const authModel = require("./authModel");
const jwt = require("jsonwebtoken");
const redis = require("../../config/redis");
const bcrypt = require("bcrypt");
const { emailServiceTransport } = require("../../helpers/email/sendEmail");
const userModel = require("../users/userModel");
module.exports = {
	register: async (request, response) => {
		try {
			const { firstName, lastName, email, password, phoneNumber } =
				request.body;

			// SET DATA
			// ENCRYPT PASSWORD => bcrypt
			const hashPassword = await bcrypt.hash(password, 10);
			const checkEmail = await authModel.getUserByEmail(email);

			const newId = uuidv4();
			const setData = {
				id: newId,
				firstName,
				lastName,
				phoneNumber,
				email,
				password: hashPassword,
				image: request.file ? request.file.filename : null,
				role: "user",
			};
			// PROSES CHECK EMAIL SUDAH PERNAH DAFTAR DIDATABASE ATAU BELUM
			if (checkEmail.length !== 0) {
				return helperResponse.response(
					response,
					409,
					"email already exist!",
					null
				);
			} else {
				const setDataEmail = {
					to: email,
					subject: "Email Verification",
					template: "index",
					data: {
						firstname: "Rino",
						callbackEndPoint: `${process.env.BASE_URL_ACTIVATE_EMAIL}/${newId}`,
					},
				};
				await emailServiceTransport(setDataEmail);

				const newUsers = await authModel.register(setData);
				return helperResponse.response(
					response,
					200,
					"Success Register!, Please verification your email!",
					newUsers
				);
			}
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
	login: async (request, response) => {
		try {
			const { email, password } = request.body;
			const checkEmail = await authModel.getUserByEmail(email);
			if (checkEmail.length < 1) {
				return helperResponse.response(
					response,
					404,
					"Email not registed!",
					null
				);
			} else if (checkEmail[0].status !== "active") {
				return helperResponse.response(
					response,
					409,
					"Please activated your email!",
					null
				);
			}
			const checkPassword = await bcrypt.compare(
				password,
				checkEmail[0].password
			);

			if (!checkPassword) {
				return helperResponse.response(
					response,
					409,
					"Password dont match!",
					null
				);
			}

			// PROSES JWT => (data yang mau diubah, PRIVATE KEY)
			const payload = checkEmail[0];
			delete payload.password;
			// accesstoken
			const token = jwt.sign({ ...payload }, process.env.JWT_SECRET, {
				expiresIn: `${process.env.JWT_EXPIRED}`,
			});

			// refresh token
			const refreshToken = jwt.sign(
				{ ...payload },
				process.env.REFRESH_TOKEN_JWT_SECRET,
				{ expiresIn: process.env.REFRESH_TOKEN_EXPIRED }
			);

			// store token to database
			const storeToken = {
				userId: payload.id,
				refreshToken,
			};

			await userModel.createRefreshToken(storeToken);

			return helperResponse.response(response, 200, "Success Login", {
				id: payload.id,
				token,
				refreshToken,
			});
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
	updatePassword: async (request, response) => {
		try {
			const userId = request.decodeToken.id;
			const { newPassword, confirmPassword } = request.body;
			const checkUser = await userModel.getUserById(userId);

			if (checkUser.length < 1) {
				return helperResponse.response(response, 404, "user not found!", null);
			}

			if (newPassword === confirmPassword) {
				const newHashPassword = await bcrypt.hash(confirmPassword, 10);
				const newDataPassword = await authModel.updateByPassword(
					newHashPassword,
					userId
				);
				return helperResponse.response(
					response,
					200,
					"Password berhasil diubah!",
					newDataPassword
				);
			} else {
				return helperResponse.response(
					response,
					409,
					"password tidak sama!",
					null
				);
			}
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
	logout: async (request, response) => {
		try {
			let token = request.headers.authorization;
			const userId = request.decodeToken.id;
			token = token.split(" ")[1];
			redis.setex(`accessToken:${token}`, 3600 * 24, token);
			const dataToken = await userModel.getUserById(userId);
			if (dataToken[0].id === userId) {
				await userModel.deleteToken(userId);
				return helperResponse.response(response, 200, "Success Logout!", null);
			} else {
				return helperResponse.response(
					response,
					404,
					"maaf user tidak ditemukan!",
					null
				);
			}
		} catch (error) {
			return helperResponse.response(
				response,
				400,
				`Bad Request : ${error.message}`,
				null
			);
		}
	},
	verivEmail: async (request, response) => {
		try {
			const userId = request.params.id;

			// check email sudah aktif atau belum
			const newStatus = "active";
			const users = await authModel.activateEmail(newStatus, userId);
			return helperResponse.response(
				response,
				"200",
				"Yeayyy, Your email has been activated!",
				users
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
};
