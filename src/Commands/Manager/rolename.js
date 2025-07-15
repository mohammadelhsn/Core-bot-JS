const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class CaseCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"rolename",
			"manager",
			["rolen"],
			"",
			"Update a role's name",
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
