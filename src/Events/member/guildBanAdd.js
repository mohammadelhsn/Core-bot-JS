const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const { fetchMemberLog, colour } = require("../../utils/structures/functions");

module.exports = class BanAddEvent extends (
	BaseEvent
) {
	constructor() {
		super("guildBanAdd");
		this.connection = StateManager.connection;
	}
	async run(client, guild, user) {
		const memberlog = await fetchMemberLog(this.connection, guild.id); // should be diffferent.
		if (memberlog === "null") {
			return;
		} else if (memberlog === null) {
			return;
		} else {
			const embed = new MessageEmbed()
				.setAuthor(
					client.user.username,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setTitle("New action")
				.setDescription(`Event: \`Guild ban add\``)
				.addField("User banned", `<@${user.id}>`)
				.addField("User ID", `\`${user.id}\``)
				.setColor(colour())
				.setTimestamp()
				.setThumbnail(user.displayAvatarURL({ dynamic: true }))
				.setFooter(`Date:`, client.user.displayAvatarURL({ dynamic: true }));
			return client.channels.cache.get(memberlog).send(embed); // change this
		}
	}
};
