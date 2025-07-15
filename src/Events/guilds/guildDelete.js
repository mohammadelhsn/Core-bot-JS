const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const { colour } = require("../../utils/structures/functions");

module.exports = class GuildDelete extends BaseEvent {
	constructor() {
		super("guildDelete");
		this.connection = StateManager.connection;
	}
	async run(client, guild) {
		try {
			await this.connection.query(
				`DELETE FROM chatmoney WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM economy WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM guildafk WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM GuildConfigurable WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM GuildLogging WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM GuildMemberEconomy WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM GuildMemberExperience WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM GuildModerations WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM Guilds WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM modnotes WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM protectedrole WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM protectedusers WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM ranks WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM rolepersist WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM serverroles WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM tags WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM welcomesystem WHERE guildId = '${guild.id}'`
			);
			await this.connection.query(
				`DELETE FROM xpsystem WHERE guildId = '${guild.id}'`
			);

			const logEmbed = new MessageEmbed()
				.setAuthor(
					client.user.username,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setTitle("Core guilds")
				.setDescription(`Event: \`Guild deleted\``)
				.setColor(colour())
				.addField("Guild name", `\`${guild.name}\``)
				.addField("Guild ID", `\`${guild.id}\``)
				.addField("Guild owner", `${guild.owner}`)
				.addField("Guild owner ID", `\`${guild.ownerID}\``)
				.addField("Guild membercount", `\`${guild.memberCount}\``)
				.setThumbnail(guild.iconURL({ dynamic: true }))
				.setTimestamp()
				.setFooter(
					`Guild created | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);
			return client.channels.cache.get("774251956184416258").send(logEmbed);
		} catch (err) {
			console.log(err);
		}
	}
};
