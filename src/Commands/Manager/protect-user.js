const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class ProtectUserCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"protectuser",
			"manager",
			["protectu"],
			"",
			"Adds a user to the protected user",
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
		let user;
	}
};
