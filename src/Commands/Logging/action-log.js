const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	off_switch,
	on_switch,
	success_emoji,
} = require("../../../emojis.json");
const {
	BaseEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
	BaseHelpEmbed,
	fetchActionLog,
} = require("../../utils/structures/functions");

module.exports = class ActionLogCommand extends BaseCommand {
	constructor() {
		super(
			"actionlog",
			"logging",
			["ac"],
			"actionlog (enable | disable) (channel)",
			"Sets the action log for the guild",
			"Administrators",
			["MANAGE_GUILD", "ADMINISTRATOR", "SEND_MESSAGES", "EMBED_LINKS"],
			[
				"actionlog enable` - Enable the action log",
				"actionlog disable` - Disables the action log",
				"actionlog help` - Sends the help embed",
			],
			[
				"actionlog",
				"actionlog enable #action-log",
				"actionlog disable",
				"actionlog help",
			],
			true,
			10000,
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

		let toConfigure = args[0];

		if (!toConfigure) {
			try {
				const actionlog = await fetchActionLog(
					this.connection,
					message.guild.id
				);

				if (actionlog == null) {
					const currentEmbed = BaseEmbed(client, message, self)
						.setTitle("Action-log command")
						.setDescription(
							`Action-log channel current settings: ${off_switch} | \`Disabled\``
						);
					return message.channel.send(currentEmbed);
				} else {
					const currentEmbed = BaseEmbed(client, message, self)
						.setTitle("Action-log command")
						.setDescription(
							`Action-log channel current settings: ${on_switch} | <#${actionlog}>`
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
		} else {
			if (toConfigure.toLowerCase().includes("enable")) {
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
						`UPDATE GuildLogging SET actionLogId = '${newValue}' WHERE guildId = '${message.guild.id}'`
					);

					const embed = await BaseSuccessEmbed(client, message, self);
					embed.setDescription(
						`${success_emoji} | Success, updated the Action-log channel to <#${newValue}>`
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
			} else if (toConfigure.toLowerCase().includes("disable")) {
				const actionlog = await fetchActionLog(
					this.connection,
					message.guild.id
				);

				if (actionlog == null) {
					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						"```\nError details: action-log is already disabled for this server```"
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				} else {
					try {
						this.connection.query(
							`UPDATE GuildLogging SET actionLogId = 'null' WHERE guildId = '${message.guild.id}'`
						);

						const disabledEmbed = await BaseSuccessEmbed(client, message, self);
						disabledEmbed.setDescription(
							`${success_emoji} Success, \`Action-log\` channel has been disabled.`
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
			} else if (toConfigure.toLowerCase().includes("help")) {
				return await BaseHelpEmbed(client, message, self);
			} else {
				const invalidChoice = await BaseErrorEmbed(client, message, self);
				invalidChoice.setDescription(
					`\`\`\`Error details: Invalid choice\`\`\``
				);
				const msg = await message.channel.send(invalidChoice);
				return msg.delete({ timeout: 10000 });
			}
		}
	}
};
