const nodemailer = require("nodemailer");

module.exports = {
	emailServiceTransport: () => {
		nodemailer.createTransport({
			host: process.env.HOST_SMTP,
			port: process.env.PORT_SMTP,
			secure: true,
			auth: {
				user: process.env.EMAIL_AUTH_SMTP,
				pass: process.env.PASS_AUTH_SMTP,
			},
		});
	},
};
