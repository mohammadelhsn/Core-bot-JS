const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
const axios = require("axios");
const {
	BaseHelpEmbed,
	BaseGeneratingEmbed,
	BaseImageEmbed,
	getString,
	getLang,
	capitalize,
} = require("../../utils/structures/functions");

module.exports = class SmugCommand extends BaseCommand {
	constructor() {
		super(
			"smug",
			"reaction images",
			[],
			"",
			"Smug",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["smug help` - Sends the help embed"],
			["smug", "smug help"],
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
			if (args[0].toLowerCase().includes("help")) {
				return await BaseHelpEmbed(client, message, self);
			}
		} else {
			const generatingEmbed = await BaseGeneratingEmbed(client, message, self);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`Nekos fun API\``
			);

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get("http://api.nekos.fun:8080/api/smug");
				const body = await res.json();

				if (!body) {
					m.delete();

					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription("```Error details: Invalid API response```");
					const msg = await message.channel.send(errEmbed);
					return msg.delete({ timeout: 10000 });
				}

				const smugEmbed = BaseImageEmbed(client, message, self)
					.setTitle("Smug command")
					.setDescription(
						`${capitalize(getString(lang, "provided_by"))}: \`Nekos life API\``
					)
					.setImage(body.image);

				m.delete();
				return message.channel.send(smugEmbed);
			} catch (e) {
				m.delete();
				console.log(e);

				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
				return message.channel.send(errEmbed);
			}
		}
	}
};
