const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseEmbed,
	BaseSuccessEmbed,
	BaseHelpEmbed,
	fetchPublicModlog,
} = require("../../utils/structures/functions");

module.exports = class PubModLogConfigCommand extends BaseCommand {
	constructor() {
		super(
			"publicmodlog",
			"logging",
			["publicml", "pml"],
			"(enable || disable || help) (mention)",
			"Configure public mod-log",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[
				"publicmodlog enable` - Enable the public modlog for the guild",
				"publicmodlog disable` - Disable the public modlog for the guild",
				"publicmodlog help` - Sends the help embed",
			],
			[
				"publicmodlog",
				"publicmodlog help",
				"publicmodlog disable",
				"publicmodlog enable #public-logs",
			],
			true,
			1000,
			false,
			false,
			["MANAGE_GUILD", "ADMINISTRATOR"],
			""
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

		let toConfigure = args[0];

		if (!toConfigure) {
			try {
				const publicmodlog = await fetchPublicModlog(
					this.connection,
					message.guild.id
				);

				if (publicmodlog === null || publicmodlog === "null") {
					const currentEmbed = BaseEmbed(client, message, this)
						.setTitle("Public-modlog command")
						.setDescription(
							`Public-modlog channel current settings: \`Disabled\``
						);
					return message.channel.send(currentEmbed);
				} else {
					const currentEmbed = BaseEmbed(client, message, this)
						.setTitle("Public-modlog command")
						.setDescription(
							`Public-modlog channel current settings: <#${publicmodlog}>`
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
						`\`\`\`Error details: You are missing the channel mention!\`\`\``
					);
					return message.channel.send(errorEmbed);
				}
				const newValue = mention.id;

				if (!newValue) {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						`Error details: \`You must include the mention!\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}
				try {
					this.connection.query(
						`UPDATE GuildLogging SET publicModLogId = '${newValue}' WHERE guildId = '${message.guild.id}'`
					);

					const embed = await BaseSuccessEmbed(client, message, this);
					embed.setDescription(
						`Successfully updated the Public-Modlog channel to <#${newValue}>`
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
				try {
					const publicmodlog = await fetchPublicModlog(
						this.connection,
						message.guild.id
					);

					if (publicmodlog === null || publicmodlog === "null") {
						const errorEmbed = await BaseErrorEmbed(client, message, this);
						errorEmbed.setDescription(
							"```\nError details: Public-modlog is already disabled for this server```"
						);
						const msg = await message.channel.send(errorEmbed);
						return msg.delete({ timeout: 10000 });
					} else {
						this.connection.query(
							`UPDATE GuildLogging SET publicModLogId = 'null' WHERE guildId = '${message.guild.id}'`
						);

						const disabledEmbed = await BaseSuccessEmbed(client, message, this);
						disabledEmbed.setDescription(
							"Success! Public-Modlog channel has been disabled."
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
			} else if (toConfigure.toLowerCase().includes("help")) {
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
	}
};
