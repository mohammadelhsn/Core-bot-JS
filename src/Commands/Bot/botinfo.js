const BaseCommand = require("../../utils/structures/BaseCommand");
const discord = require("discord.js");

module.exports = class BotInfoCommand extends BaseCommand {
	constructor() {
		super(
			"botinfo",
			"bot",
			["bi", "botinformation"],
			"(help)",
			"Shows the bots informaton!",
			"Members",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["botinfo help` - Sends the help command"],
			["botinfo", "botinfo help"],
			true,
			500,
			false,
			false,
			[],
			"Working"
		);
	}

	async run(client, message, args) {
		const prefix = await this.Settings.FetchPrefix(message.guild.id);

		const bot = {};
		bot.commands = `\`${client.commands.size}\` commands`;
		bot.servers = `\`${client.guilds.cache.size}\` servers`;
		bot.users = `\`${client.users.cache.size}\` users`;
		bot.version = `\`${client.version}\``;
		bot.node = `\`${process.version}\``;
		bot.discord = `\`${discord.version}\``;
		bot.owner = "Tech!#4472";
		bot.prefix = `\`${prefix}\``;
		bot.help = `\`${prefix}help\``;

		if (!args[0]) {
			const embed = await this.Embed.Base({
				client: client,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				title: `${client.user.username} info`,
				description: `The prefix for ${message.guild.name} is ${bot.prefix} Use ${bot.help} for more information!`,
				fields: [
					{ name: "Server count", value: `${bot.servers}` },
					{ name: "User count", value: `${bot.users}` },
					{ name: "Bot version", value: `\`${bot.version}\`` },
					{ name: "Command count", value: `${bot.commands}` },
					{ name: "Discord.js version", value: `${bot.discord}` },
					{ name: "Node version", value: `${bot.node}` },
					{ name: "Bot owner:", value: `${bot.owner}` },
				],
			});
			return message.channel.send(embed);
		} else if (args[0] === "help") {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		} else {
			const errorEmbed = await this.ErrorEmbed.InvalidChoice({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
			});
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
	}
};
