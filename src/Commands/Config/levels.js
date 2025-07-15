const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseSuccessEmbed,
	BaseEmbed,
	xpEnabled,
	getString,
	getLang,
} = require("../../utils/structures/functions");
const { on_switch, off_switch } = require("../../../emojis.json");

module.exports = class LevelsCommand extends BaseCommand {
	constructor() {
		super(
			"levels",
			"config",
			[],
			"(enable || disable || help)",
			"Enable the XP system for the guild",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS", "ADMINISTRATOR"],
			[
				"levels enable` - Enable the level system for the guild",
				"levels disable` - Disable the level system for the guild",
				"levels help` - Sends the help embed",
			],
			["levels", "levels help", "levels enable", "levels disable"],
			true,
			3000,
			false,
			false,
			["ADMINISTATOR"],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		if (!message.member.hasPermission(["ADMINISTRATOR"])) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: Missing required permissions\`\`\``
			);
			return message.channel.send(errEmbed);
		}

		const lang = await getLang(message.guild.id, this.connection);
		const self = this;
		if (args[0]) {
			if (args[0].toLowerCase() == "enable") {
				try {
					this.connection.query(
						`UPDATE xpsystem SET isEnabled = true WHERE guildId = '${message.guild.id}'`
					);

					const successEmbed = await BaseSuccessEmbed(client, message, self);
					successEmbed.setDescription(`${on_switch} | XP is now \`enabled\``);
					return message.channel.send(successEmbed);
				} catch (e) {
					console.log(e);

					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription(
						`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
					);
					return message.channel.send(errEmbed);
				}
			} else if (args[0].toLowerCase() == "disable") {
				try {
					this.connection.query(
						`UPDATE xpsystem SET isEnabled = false WHERE guildId = '${message.guild.id}'`
					);

					const successEmbed = await BaseSuccessEmbed(client, message, self);
					successEmbed.setDescription(`${off_switch} | XP is now \`disabled\``);
					return message.channel.send(successEmbed);
				} catch (e) {
					console.log(e);

					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription(
						`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
					);
					return message.channel.send(errEmbed);
				}
			} else if (args[0].toLowerCase() == "help") {
				await BaseHelpEmbed(client, message, self);
			}
		} else {
			const enabled = await xpEnabled(message.guild.id, this.connection);

			if (enabled == true) {
				const embed = BaseEmbed(client, message, self);
				embed.setDescription(
					`${on_switch} | XP system is currently: \`Enabled\``
				);
				return message.channel.send(embed);
			} else if (enabled == false) {
				const embed = BaseEmbed(client, message, self);
				embed.setDescription(
					`${off_switch} | XP system is currently: \`Disabled\``
				);
				return message.channel.send(embed);
			}
		}
	}
};
