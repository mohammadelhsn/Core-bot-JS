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

module.exports = class NekoCommand extends BaseCommand {
	constructor() {
		super(
			"neko",
			"fun",
			[],
			"(help)",
			"Sends a picture of a neko ",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["neko help` - Sends the help embed"],
			["neko", "neko help"],
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
		if (args[0]) {
			if (args[0].toLowerCase().includes("help")) {
				return await BaseHelpEmbed(client, message, self);
			}
		}

		const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
		generatingEmbed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`Nekos Life API\``
		);

		const m = await message.channel.send(generatingEmbed);
		try {
			const res = await axios.get(`http://api.nekos.fun:8080/api/neko`);
			const body = res.data;

			const nekoEmbed = BaseImageEmbed(client, message, this)
				.setTitle("Neko command")
				.setDescription(
					`${capitalize(getString(lang, "provided_by"))}: \`Nekos Life API\``
				)
				.setImage(body.image);

			m.delete();
			return message.channel.send(nekoEmbed);
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
};
