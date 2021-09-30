const helperResponse = require("../../helpers/wrapper");
const { v4: uuidv4 } = require("uuid");
const authModel = require("./authModel");
const userModel = require("../users/userModel");
const jwt = require("jsonwebtoken");
const redis = require("../../config/redis");
const bcrypt = require("bcrypt");
module.exports = {
	register: async (request, response) => {
		try {
			const { firstName, lastName, email, password, phoneNumber } =
				request.body;

			// SET DATA
			// ENCRYPT PASSWORD => bcrypt
			const hashPassword = await bcrypt.hash(password, );
			const setData = {
				id: uuidv4(),
				firstName,
				lastName,
				phoneNumber,
				email,
				password: hashPassword,
				role: "user",
			};
			const checkEmail = await authModel.getUserByEmail(email);
			// PROSES CHECK EMAIL SUDAH PERNAH DAFTAR DIDATABASE ATAU BELUM
			if (checkEmail.length !== 0) {
				return helperResponse.response(
					response,
					409,
					"email already exist!",
					null
				);
			} else {
				const newUsers = await authModel.register(setData);
				return helperResponse.response(
					response,
					200,
					"Success Registration!",
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
			const token = jwt.sign({ ...payload }, "SECRET", {
				expiresIn: "24h",
			});

			return helperResponse.response(response, 200, "Success Login", {
				id: payload.id,
				token,
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
			const userId = request.params.id;
			const { newPassword, confirmPassword } = request.body;
			const checkUser = await userModel.getUserById(userId);

			if (checkUser.length < 1) {
				return helperResponse.response(response, 404, "user not found!", null);
			}

			if (newPassword === confirmPassword) {
				// console.log("update data...");
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
					"Gagal mengupdate password!",
					null
				);
				// console.log("gagal mengupadte password!");
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
			token = token.split(" ")[1];
			redis.setex(`accessToken:${token}`, 3600 * 24, token);
			return helperResponse.response(response, 200, "Success Logout!", null);
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
