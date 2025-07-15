const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseSuccessEmbed,
	fetchAppeals,
} = require("../../utils/structures/functions");

module.exports = class AppealsConfigCommand extends BaseCommand {
	constructor() {
		super(
			"appeals",
			"config",
			["app"],
			"(enable || disable || help) (#Channel)",
			"Configure the appeals channel for the guild.",
			"",
			["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_GUILD", "ADMINISTRATOR"],
			[
				"appeals enable` - Enable appeals in the guild",
				"appeals disable` - Disables the appeals for the guild",
				"appeals help` - Sends the help embed",
			],
			["appeals", "appeals enable #appeals", "appeals disable", "appeals help"],
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
				"```\nError details: `You don't have the permissions to use this command!```"
			);
			return message.channel.send(errorEmbed);
		}
		if (!message.guild.me.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```\nError details: I don't have the permissions to fulfill this command for you!```"
			);
			return message.channel.send(errorEmbed);
		}

		const toConfigure = args[0];

		if (!toConfigure) {
			try {
				const appeals = await fetchAppeals(this.connection, message.guild.id);

				if (appeals == null) {
					const currentEmbed = BaseEmbed(client, message, self)
						.setTitle("Appeals command")
						.setDescription(`Appeal channel current settings: \`Disabled\``);
					return message.channel.send(currentEmbed);
				} else {
					const currentEmbed = BaseEmbed(client, message, self)
						.setTitle("Appeals command")
						.setDescription(`Appeals channel current settings: <#${appeals}>`);
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
				return message.channel.send(errorEmbed);
			}
			const newValue = mention.id;

			if (!newValue) {
				const errorEmbed = errorEmbedBaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`\nError details: You must include the mention!\`\`\``
				);
				return message.channel.send(errorEmbed);
			}
			try {
				this.connection.query(
					`UPDATE GuildLogging SET appealsId = '${newValue}' WHERE guildId = '${message.guild.id}'`
				);

				const embed = await BaseSuccessEmbed(client, message, self);
				embed.setDescription(
					`Successfully updated the appeals command to <#${newValue}>`
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
			const appeals = await fetchAppeals(this.connection, message.guild.id);

			if (appeals == null) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```\nError details: Appeals is already disabled for this server```"
				);
				return message.channel.send(errorEmbed);
			} else {
				try {
					this.connection.query(
						`UPDATE GuildLogging SET appealsId = 'null' WHERE guildId = '${message.guild.id}'`
					);

					const disabledEmbed = await BaseSuccessEmbed(client, message, this);
					disabledEmbed.setDescription(
						"Success! Appeals chanel has been disabled."
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
			return message.channel.send(invalidChoice);
		}
	}
};
