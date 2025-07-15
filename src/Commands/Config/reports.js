const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseEmbed,
	BaseHelpEmbed,
	BaseSuccessEmbed,
	fetchReports,
	getLang,
	getString,
} = require("../../utils/structures/functions");

module.exports = class ReportsConfigCommand extends BaseCommand {
	constructor() {
		super(
			"reports",
			"config",
			[],
			"(enable || disable || help)",
			"Configure the reports channel for the server",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[
				"reports enable` - Enables the reports channel",
				"reports disable` - Disables the report channel",
				"reports help` - Sends the help embed",
			],
			["reports", "reports enable #reports", "reports disable", "reports help"],
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
		const lang = await getLang(message.guild.id, this.connection);
		if (!message.member.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
			const errorEmbed = BaseErrorEmbed(client, message, this).setDescription(
				"```Error details: You don't have the permissions to use this command!```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (!message.guild.me.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
			const errorEmbed = BaseErrorEmbed(client, message, this).setDescription(
				"```Error details: I don't have the permissions to fulfill this command for you!```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		let toConfigure = args[0];

		if (!toConfigure) {
			try {
				const reports = await fetchReports(this.connection, message.guild.id);

				if (reports === null || reports === "null") {
					const currentEmbed = BaseEmbed(client, message, this)
						.setTitle("Reports command")
						.setDescription(`Reports channel current settings: \`Disabled\``);
					return message.channel.send(currentEmbed);
				} else {
					const currentEmbed = BaseEmbed(client, message, this)
						.setTitle("Reports command")
						.setDescription(`Reports channel current settings: <#${reports}>`);
					return message.channel.send(currentEmbed);
				}
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
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
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}
				const newValue = mention.id;

				if (!newValue) {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						`\`\`\`Error details: You must include the mention!\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}
				try {
					this.connection.query(
						`UPDATE GuildLogging SET reportsId = '${newValue}' WHERE guildId = '${message.guild.id}'`
					);

					const embed = BaseSuccessEmbed(client, message, this).setDescription(
						`Successfully updated the reports channel to <#${newValue}>`
					);
					return message.channel.send(embed);
				} catch (e) {
					console.log(e);

					const errorEmbed = BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
					);
					return message.channel.send(errorEmbed);
				}
			} else if (toConfigure.toLowerCase().includes("disable")) {
				try {
					const reports = await fetchReports(this.connection, message.guild.id);

					if (reports === null || reports === "null") {
						const errorEmbed = await BaseErrorEmbed(client, message, this);
						errorEmbed.setDescription(
							"```\nError details: Reports is already disabled for this server```"
						);
						const msg = await message.channel.send(errorEmbed);
						return msg.delete({ timeout: 10000 });
					} else {
						this.connection.query(
							`UPDATE GuildLogging SET reportsId = 'null' WHERE guildId = '${message.guild.id}'`
						);

						const disabledEmbed = await BaseSuccessEmbed(client, message, this);
						disabledEmbed.setDescription(
							"Success! Reports channel has been disabled."
						);
						return message.channel.send(disabledEmbed);
					}
				} catch (e) {
					console.log(e);

					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
					);
					return message.channel.send(errorEmbed);
				}
			} else if (toConfigure.toLowerCase().includes("help")) {
				return await BaseHelpEmbed(client, message, self);
			} else {
				const invalidChoice = await BaseErrorEmbed(client, message, this);
				invalidChoice.setDescription(
					`\`\`\`Error details: Invalid choice\`\`\``
				);
				const msg = await message.channel.send(invalidChoice);
				return msg.delete({ timeout: 10000 });
			}
		}
	}
};
