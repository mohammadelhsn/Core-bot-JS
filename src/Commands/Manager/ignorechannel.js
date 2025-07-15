const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class CaseCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"ignorechannel",
			"manager",
			["ignorec"],
			"",
			"Make the bot ignore everyone in a certain channel",
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
		//
	}
};
