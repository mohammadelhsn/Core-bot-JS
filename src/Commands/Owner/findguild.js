const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
} = require("../../utils/structures/functions");

module.exports = class FindGuildCommand extends BaseCommand {
	constructor() {
		super(
			"findguild",
			"owner",
			[],
			"",
			"Find a guild the bot is in and its settings.",
			"",
			[],
			[],
			[],
			true,
			0,
			true,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const id = args[0];

		if (!id) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: This is a required argument\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const guild = client.guilds.cache.get(id);

		if (!guild) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: This guild doesn't exist\`\`\``
			);
			return message.channel.send(errorEmbed);
		}

		let guilds;
		let guildlogging;
		let guildconfigurable;

		try {
			const res = await this.connection.query(
				`SELECT * FROM Guilds WHERE guildId = '${id}'`
			);
			if (res[0][0] == undefined) {
				guilds = "`Not setup`";
			} else {
				guilds = "`Setup`";
			}

			const ress = await this.connection.query(
				`SELECT * FROM GuildConfigurable WHERE guildId = '${id}'`
			);
			if (ress[0][0] == undefined) {
				guildconfigurable = "`Not setup`";
			} else {
				guildconfigurable = "`Setup`";
			}

			const result = await this.connection.query(
				`SELECT * FROM GuildLogging WHERE guildId = '${id}'`
			);
			if (result[0][0] == undefined) {
				guildlogging = "`Not setup`";
			} else {
				guildlogging = "`Setup`";
			}

			const embed = BaseEmbed(client, message, this)
				.setTitle(`Guild current settings`)
				.addField(`Guild name`, `\`${guild.name}\``)
				.addField(`Guild ID`, `\`${guild.id}\``)
				.addField(`Owner ID`, `\`${guild.ownerID}\``)
				.addField(`Guilds`, `${guilds}`)
				.addField(`Guild-configurable`, `${guildconfigurable}`)
				.addField(`Guild-logging `, `${guildlogging}`);
			return message.channel.send(embed);
		} catch (e) {
			console.log(e);

			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: An unexpected error has occurred\`\`\``
			);
			return message.channel.send(errEmbed);
		}
	}
};
