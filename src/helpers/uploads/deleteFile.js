const { existsSync, unlinkSync } = require("fs");
const helperResponse = require("../wrapper");
const deleteFile = (filePath) => {
	// fs.existSync // MENGECEK KEBERADAAN FILE
	if (existsSync("public/uploads/movie/")) {
		unlinkSync(filePath, (err) => {
			if (err) {
				return helperResponse.response(response, 400, err.message, null);
			}
		});
	} else {
		return helperResponse.response(
			response,
			400,
			"File tidak ditemukan...",
			null
		);
	}
};

module.exports = deleteFile;
