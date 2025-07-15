const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
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

module.exports = class FoxGirlCommand extends BaseCommand {
	constructor() {
		super(
			"foxgirl",
			"fun",
			[],
			"(help)",
			"Sends a picture of a fox girl",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["foxgirl help` - Sends the help embed"],
			["foxgirl", "foxgirl help"],
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
				`${capitalize(getString(lang, "provided_by"))}: \`Nekos life API\``
			);

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/foxgirl`);
				const body = res.data;

				const foxgirl = BaseImageEmbed(client, message, this)
					.setTitle(`Foxgirl command`)
					.setDescription(
						`${capitalize(getString(lang, "provided_by"))}: \`Nekos life API\``
					)
					.setImage(body.image);

				m.delete();
				return message.channel.send(foxgirl);
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
