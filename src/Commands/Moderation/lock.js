const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class CaseCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"lock",
			"moderation",
			[],
			"",
			"Locks all users (except those who are admin from speaking)",
			"",
			[],
			[],
			[],
			true,
			10000,
			false,
			false,
			[],
			"WIP"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {}
};
