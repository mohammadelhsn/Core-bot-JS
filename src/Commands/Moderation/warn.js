const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class WarnCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"warn",
			"moderation",
			[],
			"<@user> (reason)",
			"Warns the mentioned user for the reason given",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["warn @Tech! Spam"],
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
