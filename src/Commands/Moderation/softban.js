const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class SoftbanCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"softban",
			"moderation",
			[],
			"<user> (reason)",
			"Bans and unbans a user",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			"",
			"!softban @Tech! Noob",
			true,
			1000,
			false,
			false,
			[],
			"wip"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		let user;
		let reason;
	}
};
