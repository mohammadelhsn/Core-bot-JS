const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class SupportCommand extends BaseCommand {
	constructor() {
		super(
			"support",
			"bot",
			["supp"],
			"(help)",
			"Gives a link to the support server",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["support help` - Sends the help command"],
			["support", "support help"],
			true,
			15000,
			false,
			false,
			[],
			"Working"
		);
	}

	async run(client, message, args) {
		const prefix = await this.Settings.FetchPrefix(message.guild.id);

		if (!args[0]) {
			const supportEmbed = await this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: `${client.user.username} support`,
				description: `Your command prefix is \`${prefix}\`.\nUse \`${prefix}help\` or \`${prefix}<command name> help\` for help on commands.\nJoin the Discord for more help if you need it!`,
				link: "https://discord.gg/EFJxycM",
			});
			return message.channel.send({ embed: supportEmbed });
		} else {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}
	}
};
