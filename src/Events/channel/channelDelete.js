const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const { colour, fetchChannelLog } = require("../../utils/structures/functions");

module.exports = class ChannelDeleteEvent extends (
	BaseEvent
) {
	constructor() {
		super("channelDelete");
		this.connection = StateManager.connection;
	}
	async run(client, channel) {
		const actionlog = await fetchChannelLog(this.connection, channel.guild.id);

		if (actionlog == null) {
			return;
		} else {
			const embed = new MessageEmbed()
				.setAuthor(
					client.user.username,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setTitle("New action")
				.setDescription(`Event: \`Channel deleted\``)
				.setColor(colour())
				.addField("Channel name", `\`${channel.name}\``)
				.addField("Channel ID", `\`${channel.id}\``)
				.addField("Channel type", `\`${channel.type}\``)
				.addField("Channel NSFW?", `\`${channel.nsfw ? "Yes" : "No"}\``)
				.setTimestamp()
				.setThumbnail(channel.guild.iconURL({ dynamic: true }))
				.setFooter(
					`Channel delete | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);
			return client.channels.cache.get(actionlog).send(embed);
		}
	}
};
