const BaseEvent = require("../utils/structures/BaseEvent");
const prettyMilliseconds = require("pretty-ms");

module.exports = class TrackStartEvent extends BaseEvent {
	constructor() {
		super("trackStart");
	}
	async run(client, player, track) {
		const channel = client.channels.cache.get(player.textChannel);
        const user = await client.users.cache.get(track.requester.id);


		const embed = await this.ImageEmbed.Base({
			client: client,
			iconURL: user.displayAvatarURL({ dynamic: true }),
			id: channel.guild.id,
			text: "Now playing",
			title: "Now playing",
			description: `**__Song:__** \`${track.title}\`\n**__Requested by:__** \`${
				track.requester.tag
			}\`\n**__Duration:__** \`${prettyMilliseconds(track.duration)}\``,
			image: track.thumbnail,
		});
		embed.setURL(track.uri);
		return channel.send(embed);
	}
};
