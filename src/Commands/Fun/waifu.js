const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
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
const nl = require("nekos.life");
const neko = new nl();

module.exports = class WaifuCommand extends BaseCommand {
	constructor() {
		super(
			"waifu",
			"fun",
			[],
			"(help)",
			"Sends a picture of a waifu, just for you!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["waifu help` - Sends the help embed"],
			["waifu", "waifu help"],
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
		const lang = await getLang(message.guild.id, this.connection);
		const self = this;
		if (args[0]) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`Nekos fun API\``
			);

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/waifu`);
				const body = res.data;

				const waifuEmbed = BaseImageEmbed(client, message, this)
					.setTitle(`Waifu command`)
					.setDescription(
						`${capitalize(getString(lang, "provided_by"))}: \`Nekos life API\``
					)
					.setImage(body.image);

				m.delete();
				return message.channel.send(waifuEmbed);
			} catch (e) {
				m.delete();
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
				return message.channel.send(errorEmbed);
			}
		}
	}
};
