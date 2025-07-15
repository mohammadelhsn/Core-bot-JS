const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const ms = require("ms");
const {
	BaseErrorEmbed,
	BaseSuccessEmbed,
	BaseEmbed,
} = require("../../utils/structures/functions");

module.exports = class RemindMeCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"remindme",
			"server utilities",
			["remind", "reminder"],
			"",
			"Set a reminder.",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["re"],
			["delete"],
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
		const time = args[0];
		const reminder = args.slice(1).join(" ");

		if (!time) {
		}
		if (time <= 0) {
		}
		if (!reminder) {
		}
	} //
};
