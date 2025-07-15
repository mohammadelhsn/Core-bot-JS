const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseEmbed,
	BaseSuccessEmbed,
	BaseHelpEmbed,
	fetchSuggestions,
} = require("../../utils/structures/functions");

module.exports = class SuggestionConfigCommand extends BaseCommand {
	constructor() {
		super(
			"suggestions",
			"config",
			[],
			"(enable || disable || help) (new value)",
			"Configure the suggestions settings for this server",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[
				"suggestions help` - Sends the help embed",
				"suggestions enable` - Enables the suggestions module for the guild",
				"suggestions disable` - Disables the suggestions for the guild",
			],
			[
				"suggestions",
				"suggestions enable #suggestions",
				"suggestions disable",
				"suggestions help",
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

		let toConfigure = args[0];

		if (!toConfigure) {
			try {
				const suggestions = await fetchSuggestions(
					this.connection,
					message.guild.id
				);

				if (suggestions === null || suggestions === "null") {
					const currentEmbed = BaseEmbed(client, message, this)
						.setTitle("Suggestions command")
						.setDescription(
							`Suggestions channel current settings: \`Disabled\``
						);
					return message.channel.send(currentEmbed);
				} else {
					const currentEmbed = BaseEmbed(client, message, this)
						.setTitle("Suggestions command")
						.setDescription(
							`Suggestions channel current settings: <#${suggestions}>`
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
						`UPDATE GuildLogging SET suggestionsId = '${newValue}' WHERE guildId = '${message.guild.id}'`
					);

					const embed = await BaseSuccessEmbed(client, message, this);
					embed.setDescription(
						`Successfully updated the suggestions channel to <#${newValue}>`
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
					const suggestions = await fetchSuggestions(
						this.connection,
						message.guild.id
					);

					if (suggestions === null || suggestions === "null") {
						const errorEmbed = await BaseErrorEmbed(client, message, this);
						errorEmbed.setDescription(
							"```\nError details: Suggestions is already disabled for this server```"
						);
						const msg = await message.channel.send(errorEmbed);
						return msg.delete({ timeout: 10000 });
					} else {
						this.connection.query(
							`UPDATE GuildLogging SET suggestionsId = 'null' WHERE guildId = '${message.guild.id}'`
						);

						const disabledEmbed = await BaseSuccessEmbed(client, message, this);
						disabledEmbed.setDescription(
							"Success! Suggestions channel has been disabled."
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
