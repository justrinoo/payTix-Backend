const { existsSync, unlinkSync } = require("fs");
const deleteFileUser = (filePath) => {
	if (existsSync(filePath)) {
		unlinkSync(filePath);
		return false;
	}
};

module.exports = deleteFileUser;
