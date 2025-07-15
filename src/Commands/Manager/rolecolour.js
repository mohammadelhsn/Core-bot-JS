const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class CaseCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"rolecolour",
			"manager",
			["rolecolor", "rc"],
			"",
			"Update / set the role's colour",
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
		const self = this;
	}
};
