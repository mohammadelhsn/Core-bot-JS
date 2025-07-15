const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class UnprotectUserCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"unprotectuser",
			"manager",
			["unprotectu"],
			"",
			"Remove a user from the protect list.",
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
