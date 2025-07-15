const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
	fetchChannelLog,
} = require("../../utils/structures/functions");

module.exports = class ChannelLogCommand extends BaseCommand {
	constructor() {
		super(
			"channellog",
			"logging",
			["cl"],
			"<enable | disable | update> (mention)",
			"Sets the channel log for the guild",
			"Administrators",
			["MANAGE_GUILD", "ADMINISTRATOR"],
			[
				"channellog disable` - Disable the channel log",
				"channellog enable` - Enable the channel log",
				"channellog help` - Sends the help embed",
				"channellog update` - Update the channel log",
			],
			[
				"channellog",
				"channellog enable #channel-log",
				"channellog disable",
				"channellog help",
				"channellog update #channel-log",
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
				const channellog = await fetchChannelLog(
					this.connection,
					message.guild.id
				);

				if (channellog == null || channellog == "null") {
					const currentEmbed = BaseEmbed(client, message, self)
						.setTitle("Channel-log command")
						.setDescription(
							`Channel-log channel current settings: \`Disabled\``
						);
					return message.channel.send(currentEmbed);
				} else {
					const currentEmbed = BaseEmbed(client, message, self)
						.setTitle("Channel-log command")
						.setDescription(
							`Channel-log channel current settings: <#${channellog}>`
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
			const newValue = mention.id;

			if (!newValue) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`\nError details: You must include the mention!\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
			try {
				this.connection.query(
					`UPDATE GuildLogging SET channelLogId = '${newValue}' WHERE guildId = '${message.guild.id}'`
				);

				const embed = await BaseSuccessEmbed(client, message, self);
				embed.setDescription(
					`Successfully updated the channel-log command to <#${newValue}>`
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
			const channellog = await fetchChannelLog(
				this.connection,
				message.guild.id
			);

			if (channellog == null) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```\nError details: Channel-log is already disabled for this server```"
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			} else {
				try {
					this.connection.query(
						`UPDATE GuildLogging SET channelLogId = 'null' WHERE guildId = '${message.guild.id}'`
					);

					const disabledEmbed = await BaseSuccessEmbed(client, message, this);
					disabledEmbed.setDescription(
						"Success! Channel-log chanel has been disabled."
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
