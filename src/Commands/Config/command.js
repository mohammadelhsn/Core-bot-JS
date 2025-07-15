const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseEmbed,
	BaseImageEmbed,
	BaseSuccessEmbed,
	BaseGeneratingEmbed,
} = require("../../utils/structures/functions");

module.exports = class CommandConfigCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"command",
			"config",
			["cmd"],
			"",
			"Configure command settings with this command",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["command"],
			true,
			10000,
			false,
			false,
			"",
			"wip"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		//!command (shows settings for current server)
		//!command setting returns the same embed above
		//!command help (shows help for all)
		//!command enable (shows help for that)
		//!command disable (shows help for that)
		//!command enable ban enables the command (check for arg, check to see if the command exists, check to see if it  is already disabled (on the list))
		//!command disable ban disables the command (check for arg, check to see if the command exists, check to see if the command is already enabled(off the list))

		//  `SELECT disabledCommands FROM GuildDisabled WHERE guildId = '${message.guild.id}'`
		//  `INSERT INTO guildDisabled(guildId,disabledCommands) VALUES ('${message.guild.id}','commandName');`
		//  `DELETE FROM GuildDisabled WHERE guildId = '${message.guild.id}' AND (disabledCommands = '${toDisable}')`

		// use comments to help you get far in your command development

		let toDisable = args[0];

		const command =
			client.commands.get(toDisable) ||
			client.commands.get(client.aliases.get(command));

		if (command) {
		} else {
		}
	}
};
