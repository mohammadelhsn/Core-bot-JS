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

module.exports = class BakaCommand extends BaseCommand {
	constructor() {
		super(
			"baka",
			"fun",
			[],
			"(help)",
			"Baka",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["baka help` - Sends the help embed"],
			["baka", "baka help"],
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
				const res = await axios.get(`http://api.nekos.fun:8080/api/baka`);
				const body = res.data;

				const embed = BaseImageEmbed(client, message, this)
					.setTitle(`Baka command`)
					.setDescription(
						`${capitalize(getString(lang, "provided_by"))}: \`Nekos fun API\``
					)
					.setImage(body.image);
				m.delete();
				return message.channel.send(embed);
			} catch (e) {
				m.delete();
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}`
				);
				return message.channel.send(errorEmbed);
			}
		}
	}
};
