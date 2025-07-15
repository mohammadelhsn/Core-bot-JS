const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class CaseCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"clearnotes",
			"moderation",
			[],
			"",
			"Clear all notes on the mentioned user",
			"",
			[],
			[],
			[],
			true,
			10000,
			false,
			false,
			[],
			"WIP"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		//
	}
};
