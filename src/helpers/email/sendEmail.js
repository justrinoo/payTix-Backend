const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
module.exports = {
	emailServiceTransport: (data) =>
		new Promise((resolve, reject) => {
			const transport = nodemailer.createTransport({
				host: process.env.HOST_SMTP,
				port: process.env.PORT_SMTP,
				secure: true,
				auth: {
					user: process.env.EMAIL_AUTH_SMTP,
					pass: process.env.PASS_AUTH_SMTP,
				},
			});

			transport.use(
				"compile",
				hbs({
					viewEngine: {
						extname: ".html",
						partialsDir: path.resolve("./src/templates/email"),
						defaultLayout: false,
					},
					viewPath: path.resolve("./src/templates/email"),
					extName: ".html",
				})
			); // use template engine

			const mailOptions = {
				from: `"PayTix"< ${process.env.EMAIL_AUTH_SMTP} >`,
				to: data.to,
				subject: data.subject,
				template: data.template, // ISI DARI EMAIL
				context: data.data, // DATA YANG NNTI BSA DIMASUKAN KE DALAM TEMPLATE
			};

			transport.sendMail(mailOptions, (error, info) => {
				if (error) {
					reject(error);
				} else {
					console.log(info);
					resolve(info.response);
				}
			});
		}),
};
