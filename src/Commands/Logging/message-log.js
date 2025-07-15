const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseEmbed,
	BaseSuccessEmbed,
	BaseHelpEmbed,
	fetchMessageLog,
} = require("../../utils/structures/functions");

module.exports = class MessageLogCommand extends BaseCommand {
	constructor() {
		super(
			"messagelog",
			"logging",
			["msgl", "msglog"],
			"(enable || disable || help) (mention)",
			"Configure the message log for the guild",
			"",
			["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_GUILD", "ADMINISTRATOR"],
			[
				"messagelog enable` - Enable the message log for the guild",
				"messagelog disable` - Disable the message log for the guild",
				"messagelog help` - Sends the help embed",
			],
			[
				"messagelog",
				"messagelog enable #message-log",
				"messagelog disable",
				"messagelog help",
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
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				"```\nError details: You don't have the permissions to use this command!```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (!message.guild.me.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				"```\nError details: I don't have the permissions to fulfill this command for you!```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const toConfigure = args[0];

		if (!toConfigure) {
			try {
				const messagelog = await fetchMessageLog(
					this.connection,
					message.guild.id
				);

				if (messagelog === null || messagelog === "null") {
					const currentEmbed = BaseEmbed(client, message, this)
						.setTitle("Role-log command")
						.setDescription(`Role-log channel current settings: \`Disabled\``);
					return message.channel.send(currentEmbed);
				} else {
					const currentEmbed = BaseEmbed(client, message, this)
						.setTitle("Role-log command")
						.setDescription(
							`Role-log channel current settings: <#${messagelog}>`
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
		} else if (toConfigure === "enable") {
			try {
				let mention = message.mentions.channels.first();
				if (!mention) {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						`\`\`\`\nError details: You are missing the channel mention!\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}
				const newValue = mention.id;

				if (!newValue) {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						`\`\`\`\nError details: You must include the mention!\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}

				this.connection.query(
					`UPDATE GuildLogging SET messageLogId = '${newValue}' WHERE guildId = '${message.guild.id}'`
				);

				const embed = await BaseSuccessEmbed(client, message, this);
				embed.setDescription(
					`Successfully updated the role-log command to <#${newValue}>`
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
		} else if (toConfigure === "disable") {
			const messagelog = await fetchMessageLog(
				this.connection,
				message.guild.id
			);

			if (messagelog === null || messagelog === "null") {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					"```\nError details: Role-log is already disabled for this server```"
				);
				return message.channel.send(errorEmbed);
			} else {
				this.connection.query(
					`UPDATE GuildLogging SET messageLogId = 'null' WHERE guildId = '${message.guild.id}'`
				);

				const disabledEmbed = await BaseSuccessEmbed(client, message, this);
				disabledEmbed.setDescription(
					"Success! Message-log chanel has been `disabled`."
				);
				return message.channel.send(disabledEmbed);
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
