const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
	BaseHelpEmbed,
	getLang,
	getString,
	currencyEnabled,
} = require("../../utils/structures/functions");
const { off_switch, on_switch } = require("../../../emojis.json");

module.exports = class EconomyCommand extends BaseCommand {
	constructor() {
		super(
			"economy",
			"config",
			[],
			"(enable || disable || help)",
			"Changes the economy settings for the guild",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS", "ADMINISTRATOR"],
			[
				"economy help` - Sends the help embed",
				"economy enable` - Enable the economy for the guild",
				"economy disable` - Disable the economy for the guild",
			],
			["economy", "economy help", "economy enable", "economy disable"],
			true,
			3000,
			false,
			false,
			[],
			""
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const lang = await getLang(message.guild.id, this.connection);
		const self = this;

		if (!message.member.hasPermission(["ADMINISTRATOR"])) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: You are missing the required permissions\`\`\``
			);
			return message.channel.send(errEmbed);
		}

		if (args[0]) {
			if (args[0].toLowerCase() == "enable") {
				try {
					this.connection.query(
						`UPDATE economy SET isEnabled = true WHERE guildId = '${message.guild.id}'`
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
						`UPDATE economy SET isEnabled = false WHERE guildId = '${message.guild.id}'`
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
			const enabled = await currencyEnabled(message.guild.id, this.connection);

			if (enabled == true) {
				const embed = BaseEmbed(client, message, self);
				embed.setDescription(
					`${on_switch} | Economy is currently: \`Enabled\``
				);
				return message.channel.send(embed);
			} else if (enabled == false) {
				const embed = BaseEmbed(client, message, self);
				embed.setDescription(
					`${off_switch} | Economy is currently: \`Disabled\``
				);
				return message.channel.send(embed);
			}
		}
	}
};
