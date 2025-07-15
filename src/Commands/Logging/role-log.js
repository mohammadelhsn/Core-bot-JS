const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseEmbed,
	BaseSuccessEmbed,
	BaseHelpEmbed,
	fetchRoleLog,
} = require("../../utils/structures/functions");

module.exports = class RoleLogCommand extends BaseCommand {
	constructor() {
		super(
			"rolelog",
			"logging",
			["rl"],
			"(enable || disable || help) (mention)",
			"Configure the role log for the guild",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_GUILD", "ADMINISTRATOR"],
			[
				"rolelog enable` - Enable the role log for the guild",
				"rolelog disable` - Disable the role log for the guild",
				"rolelog help` - Sends the help embed",
			],
			[
				"rolelog",
				"rolelog help",
				"rolelog disable",
				"rolelog enable #role-logs",
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
				const rolelog = await fetchRoleLog(this.connection, message.guild.id);

				if (rolelog === null || rolelog === "null") {
					const currentEmbed = BaseEmbed(client, message, this)
						.setTitle("Role-log command")
						.setDescription(`Role-log channel current settings: \`Disabled\``);
					return message.channel.send(currentEmbed);
				} else {
					const currentEmbed = BaseEmbed(client, message, this)
						.setTitle("Role-log command")
						.setDescription(`Role-log channel current settings: <#${rolelog}>`);
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
			try {
				this.connection.query(
					`UPDATE GuildLogging SET roleLogId = '${newValue}' WHERE guildId = '${message.guild.id}'`
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
			try {
				const rolelog = await fetchRoleLog(this.connection, message.guild.id);

				if (rolelog === null || rolelog === "null") {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						"```\nError details: Role-log is already disabled for this server```"
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				} else {
					this.connection.query(
						`UPDATE GuildLogging SET roleLogId = 'null' WHERE guildId = '${message.guild.id}'`
					);

					const disabledEmbed = await BaseSuccessEmbed(client, message, this);
					disabledEmbed.setDescription(
						"Success! Role-log chanel has been disabled."
					);
					return message.channel.send(disabledEmbed);
				}
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```Error details: An unexpected error has occurred```"
				);
				return message.channel.send(errorEmbed);
			}
		} else if (toConfigure === "help") {
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
