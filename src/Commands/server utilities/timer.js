const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {} = require("../../utils/structures/functions");
const ms = require("ms");

module.exports = class TimerCommand extends BaseCommand {
	constructor() {
		super(
			"timer",
			"server utilities",
			[],
			"",
			"Create timers",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
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
