const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const { getLang, getString } = require("../../utils/structures/functions");

module.exports = class CaseCommand extends (
	BaseCommand
) { // this is a test
	constructor() {
		super(
			"ignorerole",
			"manager",
			["ignorer"],
			"",
			"Make the bot ignore everyone with the role",
			"",
			[],
			[],
			[],
			true,
			10000,
			false,
			false,
			[],
			""
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const channel = message.mentions.channels.first() || message.channel;
		if (!channel) {
		}
	}
};
