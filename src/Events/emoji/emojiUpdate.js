const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const { colour, fetchEmojiLog } = require("../../utils/structures/functions");

module.exports = class EmojiUpdateEvent extends (
	BaseEvent
) {
	constructor() {
		super("emojiUpdate");
		this.connection = StateManager.connection;
	}
	async run(client, oldEmoji, newEmoji) {
		const actionlog = await fetchEmojiLog(this.connection, newEmoji.guild.id);

		if (actionlog == null) {
			return;
		} else {
			let useEmoji;
			if (emoji.animated === true) {
				useEmoji = `<a:${newEmoji.name}:${newEmoji.id}>`;
			} else {
				useEmoji = `<:${newEmoji.name}:${newEmoji.id}>`;
			}

			if (oldEmoji.name !== newEmoji.name) {
				const embed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle("New action")
					.setDescription(`Event: \`Emoji updated\``)
					.setColor(colour())
					.addField("Emoji", `${useEmoji}`)
					.addField("Old emoji", `${oldEmoji.name}`)
					.addField("New emoji", `${newEmoji.name}`)
					.addField("Emoji ID", `${emoji.id}`)
					.setTimestamp()
					.setThumbnail(emoji.url)
					.setFooter(
						`Emoji update | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return client.channels.cache.get(actionlog).send(embed);
			}
		}
	}
};
