const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class WarnsCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"warns",
			"moderation",
			[],
			"(mention)",
			"Shows all the warnings of the mentioned user",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["warns @Tech!"],
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
		let mention;
	}
};
