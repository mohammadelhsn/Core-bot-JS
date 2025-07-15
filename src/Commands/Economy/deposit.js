const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {} = require("../../utils/structures/functions");

module.exports = class DepositCommand extends BaseCommand {
	constructor() {
		super(
			"deposit",
			"economy",
			["dep"],
			"",
			"",
			"",
			[],
			[],
			[],
			true,
			3000,
			false,
			false,
			[],
			"WIP"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
	}
};
