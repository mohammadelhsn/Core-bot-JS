const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseImageEmbed,
} = require("../../utils/structures/functions");
const fetch = require("node-fetch");
const axios = require("axios");

module.exports = class LyricsCommand extends BaseCommand {
	constructor() {
		super(
			"lyrics",
			"miscellaneous",
			[],
			"<song name>",
			"Search for lyrics to a song",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["lyrics never gonna give you up"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		// Endpoint: https://some-random-api.ml/lyrics?title=

		const song = args.join("%20");
		if (!song) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: Must include a song name!\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const res = await axios.get(
			`https://some-random-api.ml/lyrics?title=${song}`
		);
		const body = res.data;

		if (!body.title) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: The song you mentioned doesn't exist!\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		console.log(body);

		const songEmbed = BaseImageEmbed(client, message, this)
			.setTitle(`${body.title} lyrics | Author: ${body.author}`)
			.setThumbnail(body.thumbnail.genius ? body.thumbnail.genius : null)
			.setURL(body.links.genius ? body.links.genius : null);
		message.channel.send(songEmbed);
		return message.channel.send(`${body.lyrics}`, { split: true });
	}
};
