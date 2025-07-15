const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const { colour, fetchChannelLog } = require("../../utils/structures/functions");

module.exports = class ChannelUpdateEvent extends (
	BaseEvent
) {
	constructor() {
		super("channelUpdate");
		this.connection = StateManager.connection;
	}
	async run(client, oldChannel, newChannel) {
		const actionlog = await fetchChannelLog(
			this.connection,
			newChannel.guild.id
		);

		if (actionlog == null) {
			return;
		} else {
			if (oldChannel.name !== newChannel.name) {
				const embed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle("New action")
					.setDescription(`Event: \`Channel updated\``)
					.setColor(colour())
					.addField("Channel", `<#${newChannel.id}>`)
					.addField("Old channel", `\`${oldChannel.name}\``)
					.addField("New channel", `\`${newChannel.name}\``)
					.addField("Channel ID:", `\`${newChannel.id}\``)
					.setTimestamp()
					.setThumbnail(newChannel.guild.iconURL({ dynamic: true }))
					.setFooter(
						`Channel update | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return client.channels.cache.get(actionlog).send(embed);
			}
			if (oldChannel.nsfw === true && newChannel.nsfw === false) {
				// channel is no longer nsfw
				const embed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle("New action")
					.setDescription(`Event: \`Channel updated\``)
					.setColor(colour())
					.addField("Channel name", `<#${newChannel.id}>`)
					.addField("Old channel", `\`${oldChannel.nsfw ? "Yes" : "No"}\``)
					.addField("New channel", `\`${newChannel.nsfw ? "Yes" : "No"}\``)
					.addField("Channel ID:", `\`${newChannel.id}\``)
					.setTimestamp()
					.setThumbnail(newChannel.guild.iconURL({ dynamic: true }))
					.setFooter(
						`Channel update | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return client.channels.cache.get(actionlog).send(embed);
			}
			if (oldChannel.nsfw === false && newChannel.nsfw === true) {
				const embed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle("New action")
					.setDescription(`Event: \`Channel updated\``)
					.setColor(colour())
					.addField("Channel name", `<#${newChannel.id}>`)
					.addField("Old channel", `\`${oldChannel.nsfw ? "Yes" : "No"}\``)
					.addField("New channel", `\`${newChannel.nsfw ? "Yes" : "No"}\``)
					.addField("Channel ID:", `\`${newChannel.id}\``)
					.setTimestamp()
					.setThumbnail(newChannel.guild.iconURL({ dynamic: true }))
					.setFooter(
						`Channel update | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return client.channels.cache.get(actionlog).send(embed);
			}
		}
	}
};
