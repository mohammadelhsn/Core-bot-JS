const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {} = require("../../utils/structures/functions");

module.exports = class LeaderboardCommand extends BaseCommand {
	constructor() {
		super(
			"leaderboard",
			"levels",
			[],
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
