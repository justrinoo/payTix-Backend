const multer = require("multer");

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

const upload = multer({ storage }).single("image");

const uploadFilter = (request, response, next) => {
	upload(request, response, function (err) {
		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			return helperResponse.response(response, 401, err.message, null);
		}
		if (err) {
			// An unknown error occurred when uploading.
			return helperResponse.response(response, 401, err.message, null);
		}

		// Everything went fine.
		next();
	});
};

// Single: upload file yang diupload hanya 1 file saja
// Array: Upload file yang diupload lebih dari 1 file
// Fields: Upload file untuk mengupload (file) untuk lebih dari 1 field

module.exports = uploadFilter;
