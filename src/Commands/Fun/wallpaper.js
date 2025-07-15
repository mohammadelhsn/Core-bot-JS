const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
const axios = require("axios");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseImageEmbed,
	getString,
	getLang,
	capitalize,
} = require("../../utils/structures/functions");
const nl = require("nekos.life");
const neko = new nl();

module.exports = class WallpaperCommand extends BaseCommand {
	constructor() {
		super(
			"wallpaper",
			"fun",
			[],
			"(help)",
			"Sends a wallpaper for you!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["wallpaper help` - Sends the help embed"],
			["wallpaper", "wallpaper help"],
			true,
			3000,
			false,
			true,
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
				`${capitalize(getString(lang, "provided_by"))}: \`Nekos Life API\``
			);

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/wallpaper`);
				const body = res.data;

				const embed = BaseImageEmbed(client, message, this)
					.setTitle(`Wallpaper command`)
					.setDescription(
						`${capitalize(getString(lang, "provided_by"))}: \`Nekos life\``
					)
					.setImage(body.image);

				m.delete();
				return message.channel.send(embed);
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
