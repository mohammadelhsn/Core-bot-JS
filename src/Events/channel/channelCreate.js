const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const { fetchChannelLog, colour } = require("../../utils/structures/functions");

module.exports = class ChannelCreateEvent extends BaseEvent {
	constructor() {
		super("channelCreate");
		this.connection = StateManager.connection;
	}
	async run(client, channel) {
		if (channel.type === "dm") return;

		const actionlog = await fetchChannelLog(this.connection, channel.guild.id);

		if (actionlog == null) {
			return;
		} else {
			const channelEmbed = new MessageEmbed()
				.setAuthor(
					client.user.username,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setTitle("New action")
				.setDescription(`Event: \`Channel created\``)
				.addField("Channel name", `<#${channel.id}>`)
				.addField("Channel type", `\`${channel.type}\``)
				.addField("Channel ID:", `\`${channel.id}\``)
				.addField("Channel NSFW?", `${channel.nsfw ? "`Yes`" : "`No`"}`)
				.addField("Created at:", `\`${channel.createdAt}\``)
				.setTimestamp()
				.setThumbnail(channel.guild.iconURL({ dynamic: true }))
				.setColor(colour())
				.setFooter(
					`Channel create | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);

			return client.channels.cache.get(actionlog).send(channelEmbed);
		}
	}
};
