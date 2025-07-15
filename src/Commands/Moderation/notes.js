const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class NotesCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"notes",
			"moderation",
			[],
			"",
			"View all notes on the mentioned user",
			"",
			[],
			[],
			[],
			true,
			3000,
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
