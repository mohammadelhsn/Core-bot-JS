const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseEmbed,
	BaseSuccessEmbed,
	BaseHelpEmbed,
	fetchModlog,
} = require("../../utils/structures/functions");

module.exports = class ModlogConfigCommand extends BaseCommand {
	constructor() {
		super(
			"modlog",
			"logging",
			["modl"],
			"",
			"Configure moderation log",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[
				"modlog enable` - Enables the modlog for the guild",
				"modlog disable` - Disable the modlog for the guild",
				"modlog help` - Sends the help embed",
			],
			[
				"modlog",
				"modlog help",
				"modlog disable",
				"modlog enable #moderation-logs",
			],
			true,
			1000,
			false,
			false,
			[],
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

		let toConfigure = args[0];

		if (!toConfigure) {
			const modlog = await fetchModlog(this.connection, message.guild.id);

			if (modlog === null || modlog === "null") {
				const currentEmbed = BaseEmbed(client, message, this)
					.setTitle("Modlog command")
					.setDescription(`Modlog channel current settings: \`Disabled\``);
				return message.channel.send(currentEmbed);
			} else {
				const currentEmbed = BaseEmbed(client, message, this)
					.setTitle("Modlog command")
					.setDescription(`Modlog channel current settings: <#${modlog}>`);
				return message.channel.send(currentEmbed);
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
					return message.channel.send(errorEmbed);
				}
				try {
					this.connection.query(
						`UPDATE GuildLogging SET modLogId = '${newValue}' WHERE guildId = '${message.guild.id}'`
					);

					const embed = await BaseSuccessEmbed(client, message, this);
					embed.setDescription(
						`Successfully updated the modlog channel to <#${newValue}>`
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
				const modlog = await fetchModlog(this.connection, message.guild.id);
				if (modlog === null || modlog === "null") {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						"```Error details: Modlog is already disabled for this server```"
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				} else {
					this.connection.query(
						`UPDATE GuildLogging SET modLogId = 'null' WHERE guildId = '${message.guild.id}'`
					);

					const disabledEmbed = await BaseSuccessEmbed(client, message, this);
					disabledEmbed.setDescription(
						"Success! Modlog channel has been disabled."
					);
					return message.channel.send(disabledEmbed);
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
