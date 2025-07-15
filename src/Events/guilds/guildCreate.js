const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const { colour } = require("../../utils/structures/functions");

module.exports = class GuildCreateEvent extends BaseEvent {
	constructor() {
		super("guildCreate");
		this.connection = StateManager.connection;
	}

	async run(client, guild) {
		try {
			await this.connection.query(
				`INSERT INTO Guilds VALUES('${guild.id}', '${guild.ownerID}')`
			);
			await this.connection.query(
				`INSERT INTO GuildConfigurable (guildId) VALUES ('${guild.id}')`
			);
			await this.connection.query(
				`INSERT INTO GuildLogging (guildId) VALUES ('${guild.id}')`
			);
			await this.connection.query(
				`INSERT INTO welcomesystem (guildId) VALUES ('${guild.id}')`
			);
			await this.connection.query(
				`INSERT INTO leavesystem (guildId) VALUES ('${guild.id}')`
			);
			await this.connection.query(
				`INSERT INTO economy (guildId) VALUES('${guild.id}')`
			);
			await this.connection.query(
				`INSERT INTO xpsystem (guildId) VALUES('${guild.id}')`
			);
			await this.connection.query(
				`INSERT INTO serverroles (guildId) VALUES('${guild.id}')`
			);
			const logEmbed = new MessageEmbed()
				.setAuthor(
					client.user.username,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setTitle("Core guilds")
				.setDescription(`Event: \`New guild\``)
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
			client.channels.cache.get("774251956184416258").send(logEmbed);
			StateManager.emit("guildAdded", guild.id, "!");
		} catch (err) {
			console.log(err);
		}
	}
};
