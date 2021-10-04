const { existsSync, unlinkSync } = require("fs");
const helperResponse = require("../wrapper");
const deleteFileUser = (filePath) => {
	if (existsSync("public/uploads/user/")) {
		unlinkSync(filePath, (err) => {
			if (err) {
				return helperResponse.response(response, 400, err.message, null);
			}
		});
		return false;
	} else {
		return helperResponse.response(
			response,
			400,
			"File tidak ditemukan...",
			null
		);
	}
};

module.exports = deleteFileUser;
