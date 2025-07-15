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
const fetch = require("node-fetch");

module.exports = class LaughCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"laugh",
			"reaction images",
			[],
			"(help)",
			"Laugh ",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["laugh help` - Sends the help embed"],
			["laugh", "laugh help"],
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
			const generatingEmbed = await BaseGeneratingEmbed(client, message, self);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`Nekos fun API\``
			);

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/laugh`);
				const body = res.data;

				const imageEmbed = BaseImageEmbed(client, message, self)
					.setTitle(`Laugh command`)
					.setDescription(`<@${message.author.id}> laughs!`)
					.setImage(body.image);

				m.delete();
				return message.channel.send(imageEmbed);
			} catch (e) {
				m.delete();
				console.log(e);

				const errEmbed = await BaseErrorEmbed(client, message, this);
				errEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
				return message.channel.send(errEmbed);
			}
		}
	}
};
