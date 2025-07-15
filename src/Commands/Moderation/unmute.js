const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class UnmuteCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"unmute",
			"moderation",
			[],
			"<@user> (reason)",
			"Unmutes the mentioned uer from the guild",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["unmute @Tech!"],
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
