const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {} = require("../../utils/structures/functions");

module.exports = class MaxBalCommand extends BaseCommand {
	constructor() {
		super(
			"max-balance",
			"economy",
			["max-bal", "maxbal"],
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
