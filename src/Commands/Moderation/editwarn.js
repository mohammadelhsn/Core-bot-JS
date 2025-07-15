const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class CaseCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"editwarn",
			"moderation",
			[],
			"",
			"Edit a warn on the mentioned user",
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
