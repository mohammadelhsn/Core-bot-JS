const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const axios = require("axios");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseImageEmbed,
	getLang,
	getString,
	capitalize,
} = require("../../utils/structures/functions");

module.exports = class MemeCommand extends BaseCommand {
	constructor() {
		super(
			"meme",
			"memes",
			[],
			"",
			"Sends some memes!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["meme help` - Sends the help command"],
			["meme", "meme help"],
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
		const self = this;
		const lang = await getLang(message.guild.id, this.connection);
		if (args[0]) {
			if (args[0].toLowerCase().includes("help")) {
				return await BaseHelpEmbed(client, message, self);
			}
		}

		const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
		generatingEmbed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`Duncte123 API\``
		);

		const m = await message.channel.send(generatingEmbed);
		const res = await axios.get("https://apis.duncte123.me/meme");
		const body = res.data;

		if (!body) {
			m.delete();

			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription("```Error details: API error```");
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		} else {
			const memeEmbed = BaseImageEmbed(client, message, this)
				.setTitle(body.data.title)
				.setDescription(
					`${capitalize(getString(lang, "provided_by"))}: \`Duncte123 API\``
				)
				.setURL(body.data.url)
				.setImage(body.data.image);

			m.delete();
			return message.channel.send(memeEmbed);
		}
	}
};
