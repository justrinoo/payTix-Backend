module.exports = {
	response: (response, status, message, data, pagination) => {
		const results = {};
		results.status = status || 200;
		results.message = message;
		results.data = data;
		results.pagination = pagination;
		return response.status(results.status).json(results);
	},
};
