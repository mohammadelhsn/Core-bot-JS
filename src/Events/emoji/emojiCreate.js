const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const { colour, fetchEmojiLog } = require("../../utils/structures/functions");

module.exports = class EmojiCreateEvent extends (
	BaseEvent
) {
	constructor() {
		super("emojiCreate");
		this.connection = StateManager.connection;
	}
	async run(client, emoji) {
		// check to see if logging is on, if it is send an embed to the logging channel, otherwise return
		let useEmoji;
		if (emoji.animated === true) {
			useEmoji = `<a:${emoji.name}:${emoji.id}>`;
		} else {
			useEmoji = `<:${emoji.name}:${emoji.id}>`;
		}

		const actionlog = await fetchEmojiLog(this.connection, emoji.guild.id);

		if (actionlog == null) {
			return;
		} else {
			const embed = new MessageEmbed()
				.setAuthor(
					client.user.username,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setTitle("New action")
				.setDescription(`Event: \`Emoji created\``)
				.setColor(colour())
				.addField("Emoji:", `${useEmoji}`)
				.addField("Emoji name", `${emoji.name}`)
				.addField("Animated?", `${emoji.animted ? "Yes" : "No"}`)
				.addField("Emoji ID", `${emoji.id}`)
				.setTimestamp()
				.setThumbnail(emoji.url)
				.setFooter(
					`Created at: ${emoji.createdAt} | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);

			return client.channels.cache.get(actionlog).send(embed);
		}
	}
};
