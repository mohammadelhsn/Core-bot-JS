const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class UnbanCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"unban",
			"moderation",
			[],
			"!unban <user> (reason)",
			"Unbans the mentioned user from the guild",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["unban @Tech!"],
			true,
			1000,
			false,
			false,
			[],
			"wip"
		);
		this.connecion = StateManager.connection;
	}
	async run(client, message, args) {
		let user;
		let reason;
	}
};
