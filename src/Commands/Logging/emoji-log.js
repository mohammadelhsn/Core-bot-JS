const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseHelpEmbed,
	BaseEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
	fetchEmojiLog,
} = require("../../utils/structures/functions");

module.exports = class EmojiLogCommand extends BaseCommand {
	constructor() {
		super(
			"emojilog",
			"logging",
			["el"],
			"(enable || disable || help) (mention)",
			"Configure the emoji log for the guild",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_GUILD", "ADMINISTRATOR"],
			[
				"emojilog enable` - Enable the emoji log for the guild",
				"emojilog disable` - Disable the emoji log for the guild",
				"emojilog help` - Sends the help embed",
			],
			[
				"emojilog",
				"emojilog enable #emoji-log",
				"emojilog disable",
				"emojilog help",
			],
			true,
			1000,
			false,
			false,
			["MANAGE_GUILD", "ADMINISTRATOR"],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
		if (!message.member.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```\nError details: You don't have the permissions to use this command!```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (!message.guild.me.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```\nError details: I don't have the permissions to fulfill this command for you!```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const toConfigure = args[0];

		if (!toConfigure) {
			try {
				const emojilog = await fetchEmojiLog(this.connection, message.guild.id);

				if (emojilog == null || emojilog == "null") {
					const currentEmbed = BaseEmbed(client, message, self)
						.setTitle("Emoji-log command")
						.setDescription(`Emoji-log channel current settings: \`Disabled\``);
					return message.channel.send(currentEmbed);
				} else {
					const currentEmbed = BaseEmbed(client, message, self)
						.setTitle("Emoji-log command")
						.setDescription(
							`Emoji-log channel current settings: <#${emojilog}>`
						);
					return message.channel.send(currentEmbed);
				}
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```Error details: An unexpected error has occurred```"
				);
				return message.channel.send(errorEmbed);
			}
		} else if (toConfigure == "enable") {
			let mention = message.mentions.channels.first();
			if (!mention) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`\nError details: You are missing the channel mention!\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			try {
				const newValue = mention.id;

				if (!newValue) {
					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						`\`\`\`\nError details: You must include the mention!\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}

				this.connection.query(
					`UPDATE GuildLogging SET emojiLogId = '${newValue}' WHERE guildId = '${message.guild.id}'`
				);

				const embed = await BaseSuccessEmbed(client, message, self);
				embed.setDescription(
					`Successfully updated the Emoji-log command to <#${newValue}>`
				);
				return message.channel.send(embed);
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```Error details: An unexpected error has occurred```"
				);
				return message.channel.send(errorEmbed);
			}
		} else if (toConfigure == "disable") {
			const emojilog = await fetchEmojiLog(this.connection, message.guild.id);

			if (emojilog == null) {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					"```\nError details: Emoji-log is already disabled for this server```"
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			} else {
				try {
					this.connection.query(
						`UPDATE GuildLogging SET emojiLogId = 'null' WHERE guildId = '${message.guild.id}'`
					);

					const disabledEmbed = await BaseSuccessEmbed(client, message, this);
					disabledEmbed.setDescription(
						"Success! Emoji-log chanel has been disabled."
					);
					return message.channel.send(disabledEmbed);
				} catch (e) {
					console.log(e);

					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						"```Error details: An unexpected error has occurred```"
					);
					return message.channel.send(errorEmbed);
				}
			}
		} else if (toConfigure == "help") {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const invalidChoice = await BaseErrorEmbed(client, message, this);
			invalidChoice.setDescription(
				`\`\`\`\nError details: Invalid choice\`\`\``
			);
			const msg = await message.channel.send(invalidChoice);
			return msg.delete({ timeout: 10000 });
		}
	}
};
