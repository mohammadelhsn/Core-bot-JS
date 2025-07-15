const BaseEvent = require("../utils/structures/BaseEvent");

module.exports = class QueueEndEvent extends BaseEvent {
	constructor() {
		super("queueEnd");
	}
	async run(client, player) {
		const self = this;
		const channel = client.channels.cache.get(player.textChannel);
		const lang = await this.Translator.getLang(channel.guild.id);
		const embed = await self.Embed.Base({
			client: client,
			iconURL: channel.guild.iconURL({ dynamic: true }),
			id: channel.guild.id,
			text: "Queue end",
			title: "Queue has ended",
			description: `${this.Utils.capitalize(
				this.Translator.getString(lang, "provided_by")
			)}: \`Lavalink\``,
		});
		channel.send(embed);
		return player.destroy();
	}
};
