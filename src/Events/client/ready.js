const BaseEvent = require("../../utils/structures/BaseEvent");

module.exports = class ReadyEvent extends BaseEvent {
	constructor() {
		super("ready");
	}
	run(client) {
		client.manager.init(client.user.id);
		client.version = "0.7";
		client.updated_at = `Thursday, March 11, 2021 21:53:50`;
		console.log("✅ | " + client.user.tag + " has logged in");

		setInterval(function () {
			let status = `${client.guilds.cache.size} servers | ${client.users.cache.size} users!`;
			client.user.setActivity(status, { type: "WATCHING" });
		}, 10000);
	}
};
