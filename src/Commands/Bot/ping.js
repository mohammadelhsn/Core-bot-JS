const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class PingCommand extends BaseCommand {
	constructor() {
		super(
			"ping",
			"bot",
			["pi"],
			"",
			"Shows the bots ping",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["ping help` - Sends the help command"],
			["ping", "ping help"],
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
		} else {
			const embed = await this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: `${client.user.username} ping`,
				description: `Pinging...`,
			});
			const m = await message.channel.send({ embed: embed });

			const ping = m.createdTimestamp - message.createdTimestamp;

			const updatedPing = await this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: `${client.user.username} ping`,
				description: `Bot latency: \`${ping}\`ms | Websocket ping: \`${client.ws.ping}\`ms`,
			});
			return m.edit({ embed: updatedPing });
		}
	}
};
