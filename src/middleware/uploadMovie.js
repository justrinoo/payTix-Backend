const multer = require("multer");
const path = require("path");
const helperResponse = require("../helpers/wrapper");

const storage = multer.diskStorage({
	destination(reqeust, file, callback) {
		callback(null, "public/uploads/movie");
	},
	filename(request, file, callback) {
		callback(
			null,
			new Date().toISOString().replace(/:/g, "-") + file.originalname
		);
	},
});

const upload = multer({
	storage,
	limits: {
		fileSize: 1000000,
	},
	fileFilter: (req, file, callback) => {
		if (
			path.extname(file.originalname) !== ".png" &&
			path.extname(file.originalname) !== ".jpg" &&
			path.extname(file.originalname) !== ".jpeg"
		) {
			callback(new Error("Upload file harus berupa png, jpg, dan jpeg"));
		}
		callback(null, true);
	},
}).single("image");

const uploadFilter = (request, response, next) => {
	upload(request, response, function (err) {
		if (err instanceof multer.MulterError) {
			return helperResponse.response(response, 401, err.message, null);
		}
		if (err) {
			return helperResponse.response(response, 401, err.message, null);
		}
		next();
	});
};

module.exports = uploadFilter;
