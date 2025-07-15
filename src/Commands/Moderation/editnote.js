const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class EditnoteCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"editnote",
			"moderation",
			[],
			"",
			"Edit a note on the mentioned user",
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
	}
	async run(client, message, args) {
		//
	}
};
