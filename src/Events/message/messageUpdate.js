const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const {
	colour,
	fetchMessageLog,
	capitalize,
	getString,
	getLang,
} = require("../../utils/structures/functions");

module.exports = class MessageUpdateEvent extends (
	BaseEvent
) {
	constructor() {
		super("messageUpdate");
		this.connection = StateManager.connection;
	}
	async run(client, oldMessage, newMessage) {
		if (newMessage.content === oldMessage.content) return;
		if (newMessage.author.id === client.user.id) return;
		if (newMessage.author.bot) return;

		const actionlog = await fetchMessageLog(
			this.connection,
			newMessage.guild.id
		);
		const lang = await getLang(newMessage.guild.id, this.connection);

		if (actionlog == null) {
			return;
		} else {
			const embed = new MessageEmbed()
				.setAuthor(
					client.user.username,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setTitle(`${capitalize(getString(lang, "new_action"))}`)
				.setDescription(
					`${capitalize(
						getString(lang, "event")
					)}: \`Message edited\` | [JUMP TO MESSAGE](https://discordapp.com/channels/${
						newMessage.guild.id
					}/${newMessage.channel.id}/${newMessage.id})`
				)
				.setColor(colour())
				.addField("Message author", `<@${newMessage.author.id}>`)
				.addField("Old message", `"${oldMessage.content}"`)
				.addField("New message", `"${newMessage.content}"`)
				.addField("Date:", `\`${newMessage.createdAt.toLocaleString()}\``)
				.addField("Message channel", `<#${newMessage.channel.id}>`)
				.setTimestamp()
				.setThumbnail(newMessage.guild.iconURL({ dynamic: true }))
				.setFooter(
					`Message ID: ${newMessage.id} | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setURL(
					`https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}`
				);

			return client.channels.cache.get(actionlog).send(embed);
		}
	}
};
