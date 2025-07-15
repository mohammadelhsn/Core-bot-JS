const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const { colour, fetchEmojiLog } = require("../../utils/structures/functions");

module.exports = class EmojiDeleteEvent extends (
	BaseEvent
) {
	constructor() {
		super("emojiDelete");
		this.connection = StateManager.connection;
	}
	async run(client, emoji) {
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
				.setDescription(`Event: \`Emoji deleted\``)
				.setColor(colour())
				.addField("Emoji name", `${emoji.name}`)
				.addField("Emoji ID", `${emoji.id}`)
				.addField("Emoji animated", `${emoji.animated ? "Yes" : "No"}`)
				.setThumbnail(emoji.url)
				.setTimestamp()
				.setFooter(
					`Emoji delete | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);
			return client.channels.cache.get(actionlog).send(embed);
		}
	}
};
