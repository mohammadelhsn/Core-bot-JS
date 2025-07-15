const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseEmbed,
	BaseSuccessEmbed,
	fetchMemberLog,
} = require("../../utils/structures/functions");

module.exports = class MemberLogCommand extends BaseCommand {
	constructor() {
		super(
			"memberlog",
			"logging",
			["ml"],
			"(enable || disable || help) (mention)",
			"Configure the member log for the guild",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_GUILD", "ADMINISTRATOR"],
			[
				"memberlog enable` - Enable the member log for the guild",
				"memberlog disable` - Disable the member log for the guild",
				"memberlog help` - Sends the help embed",
			],
			[
				"memberlog",
				"memberlog enable #member-log",
				"memberlog disable",
				"memberlog help",
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

		let toConfigure = args[0];

		if (!toConfigure) {
			try {
				const memberlog = await fetchMemberLog(
					this.connection,
					message.guild.id
				);

				if (memberlog == null) {
					const currentEmbed = BaseEmbed(client, message, self)
						.setTitle("Member-log command")
						.setDescription(`Memberlog channel current settings: \`Disabled\``);
					return message.channel.send(currentEmbed);
				} else {
					const currentEmbed = BaseEmbed(client, message, self)
						.setTitle("Member-log command")
						.setDescription(
							`Member-log channel current settings: <#${memberlog}>`
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
						`UPDATE GuildLogging SET memberLogId = '${newValue}' WHERE guildId = '${message.guild.id}'`
					);

					const embed = BaseEmbed(client, message, self)
						.setTitle("Member-log command")
						.setDescription(
							`Successfully updated the member-log channel to <#${newValue}>`
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
				const memberlog = await fetchMemberLog(
					this.connection,
					message.guild.id
				);

				if (memberlog == null || memberlog == "null") {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						"```\nError details: Member-log is already disabled for this server```"
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				} else {
					try {
						this.connection.query(
							`UPDATE GuildLogging SET memberLogId = 'null' WHERE guildId = '${message.guild.id}'`
						);

						const disabledEmbed = await BaseSuccessEmbed(client, message, this);
						disabledEmbed.setDescription(
							"Success! Member-log channel has been disabled."
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
