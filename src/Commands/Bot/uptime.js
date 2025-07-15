const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class UptimeCommand extends BaseCommand {
	constructor() {
		super(
			"uptime",
			"bot",
			["ut", "up"],
			"",
			"Shows the bots uptime",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["uptime help` - Sends the help command"],
			["uptime", "uptime help"],
			true,
			10000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		if (args[0]) {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}
		const uptimeEmbed = await this.Embed.Base({
			client: client,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			command: this,
			title: `${client.user.username} uptime`,
			description: `I have been online for \`${this.Utils.Duration(
				client.uptime
			)}\``,
		});
		return message.channel.send({ embed: uptimeEmbed });
	}
};
