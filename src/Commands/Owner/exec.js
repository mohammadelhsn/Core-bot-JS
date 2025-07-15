const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const { exec } = require("child_process");

module.exports = class ExecuteCommand extends BaseCommand {
	constructor() {
		super(
			"execute",
			"owner",
			[],
			"(command prompt code)",
			"Executes given argument into the command prompt",
			"Owner",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["execute node --version"],
			true,
			3000,
			true,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		exec(args.join(" "), (error, stdout) => {
			const response = stdout || error;
			return message.channel.send(response, { split: true, code: true });
		});
	}
};
