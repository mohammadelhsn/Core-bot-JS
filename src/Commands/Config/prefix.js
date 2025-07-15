const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseEmbed,
	BaseSuccessEmbed,
	BaseHelpEmbed,
	fetchPrefix,
} = require("../../utils/structures/functions");

module.exports = class PrefixCommand extends BaseCommand {
	constructor() {
		super(
			"prefix",
			"config",
			["pre"],
			"<new prefix || help>",
			"Configure the prefix for the current guild",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["prefix help` - Sends the help embed"],
			["prefix", "prefix ?", "prefix help"],
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
		const nprefix = args[0];

		if (!nprefix) {
			try {
				const prefix = await fetchPrefix(this.connection, message.guild.id);

				const em = BaseEmbed(client, message, self).setDescription(
					`The current prefix for ${message.guild.name} is: \`${prefix}\``
				);
				return message.channel.send(em);
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```Error details: An unexpected error has occurred```"
				);
				return message.channel.send(errorEmbed);
			}
		} else {
			if (nprefix) {
				if (nprefix.toLowerCase() == "help") {
					return await BaseHelpEmbed(client, message, self);
				} else {
					if (
						!message.member.hasPermission(["MANAGE_GUILD" || "ADMINISTRATOR"])
					) {
						const eEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription(
							"```Error details You don't have the permissions to use this command```"
						);
						const msg = await message.channel.send(eEmbed);
						return msg.delete({ timeout: 10000 });
					} else {
						try {
							this.connection.query(
								`UPDATE GuildConfigurable SET cmdPrefix = '${nprefix}' WHERE guildId = '${message.guild.id}'`
							);

							const successEmbed = await BaseSuccessEmbed(
								client,
								message,
								self
							);
							successEmbed.setDescription(
								`Successfully updated guild prefix to \`${nprefix}\``
							);
							return message.channel.send(successEmbed);
						} catch (e) {
							console.log(e);

							const errorEmbed = await BaseErrorEmbed(client, message, self);
							errorEmbed.setDescription(
								"```Error details: An unexpected error has occurred```"
							);
							return message.channel.send(errorEmbed);
						}
					}
				}
			}
		}
	}
};
