const nodemailer = require("nodemailer");

module.exports = {
	serviceSendEmail: () => {
		nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 000,
			secure: false,
			auth: {
				user: "rinosatyaputra@gmail.com",
				pass: "r02151139420",
			},
		});
	},
};
