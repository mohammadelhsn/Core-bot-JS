const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class UnprotectUserCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"unprotectrole",
			"manager",
			["unprotectr"],
			"",
			"Remove a role from the protected list",
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
