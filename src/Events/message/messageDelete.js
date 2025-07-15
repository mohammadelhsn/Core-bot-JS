const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const {
	colour,
	getString,
	getLang,
	capitalize,
	fetchMessageLog,
} = require("../../utils/structures/functions");

module.exports = class MessageDeleteEvent extends (
	BaseEvent
) {
	constructor() {
		super("messageDelete");
		this.connection = StateManager.connection;
	}
	async run(client, message) {
		client.snipes = new Map();
		if (message.author.id === client.user.id) return;
		if (message.author.bot) return;
		if (!message.guild) return;

		client.snipes.set(message.channel.id, {
			msg: message.content,
			user: message.author.id,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			image: message.attachments.first()
				? message.attachments.first().proxyURL
				: "",
			url: message.attachments.first() ? message.attachments.first().url : "",
			fileName: message.attachments.first()
				? message.attachments.first().name
				: "",
		});

		const actionlog = await fetchMessageLog(this.connection, message.guild.id);
		const lang = await getLang(message.guild.id, this.connection);

		if (actionlog == null) {
			return;
		} else {
			const embed = new MessageEmbed()
				.setTitle(`${capitalize(getString(lang, "new_action"))}`)
				.setDescription(
					`${capitalize(getString(lang, "event"))}: \`Message deleted\` ${
						message.attachments.first()
							? `| Proxy URL: [${message.attachments.first().name}](${
									message.attachments.first().proxyURL
							  }) || Backup: [${message.attachments.first().name}](${
									message.attachments.first().url
							  })`
							: "\u200B"
					}`
				)
				.setImage(
					`${
						message.attachments.first()
							? message.attachments.first().proxyURL
							: ""
					}`
				)
				.setColor(colour())
				.addField("Message author", `<@${message.author.id}>`)
				.addField(
					"Deleted message",
					`\`${message.content ? `${message.content}` : "N/A"}\``
				)
				.addField("Date:", `${message.createdAt.toLocaleString()}`)
				.addField("Message channel", `<#${message.channel.id}>`)
				.setTimestamp()
				.setThumbnail(message.guild.iconURL({ dynamic: true }))
				.setFooter(
					`Message ID: ${message.id} | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);

			return client.channels.cache.get(actionlog).send(embed);
		}
	}
};
