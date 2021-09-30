const { existsSync, unlinkSync } = require("fs");
const helperResponse = require("../wrapper");
const deleteFile = (filePath) => {
	// fs.existSync // MENGECEK KEBERADAAN FILE
	if (existsSync("public/uploads/movie/")) {
		// console.log("file ada nih..", filePath);
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
	// fs.unlink // MENGHAPUS FILE
	// PROSES HAPUS GAMBAR DARI DIRECTORY PUBLIC/UPLOADS/MOVIE
	// console.log("gambar terhapus...", filePath);
};

module.exports = deleteFile;
