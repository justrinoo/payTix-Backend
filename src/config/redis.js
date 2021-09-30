const redis = require("redis");

const client = redis.createClient();

client.on("connect", () => {
	console.log("Successfully connected databsae redis...");
});

module.exports = client;
