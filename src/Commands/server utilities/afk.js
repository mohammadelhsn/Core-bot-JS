const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {} = require("../../utils/structures/functions");

module.exports = class AfkCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"afk",
			"server utilities",
			["away"],
			"",
			"Set yourself as AFK in the server.",
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
