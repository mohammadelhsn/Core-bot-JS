const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const { BaseHelpEmbed } = require("../../utils/structures/functions");

module.exports = class TimedBlacklist extends (
	BaseCommand
) {
	constructor() {
		super(
			"timedblacklist",
			"owner",
			[],
			"<user> <time> (reason)",
			"Blacklists the mentioned user for a mentioned time from using the bot",
			"Owner",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["timedblacklist @Tech! 5m stop"],
			true,
			1000,
			true,
			false,
			"WIP"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
	}
};
