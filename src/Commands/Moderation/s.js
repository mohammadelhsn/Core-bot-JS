const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class SayCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"s",
			"moderation",
			["say"],
			"!s <what you want the bot to repeat>",
			"Repeats what every you say",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			"",
			["s hi"],
			true,
			1000,
			false,
			false,
			[],
			"wip"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		let toRepeat;
	}
};
