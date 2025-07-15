const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseImageEmbed,
	getString,
	getLang,
} = require("../../utils/structures/functions");
const fetch = require("node-fetch");
const axios = require("axios");

module.exports = class WinkCommand extends BaseCommand {
	constructor() {
		super(
			"wink",
			"reaction images",
			[],
			"",
			";)",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["wink help` - Sends the help embed"],
			["wink", "wink help"],
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
		// Endpoint: https://some-random-api.ml/animu/wink

		if (args[0]) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const generatingEmbed = await BaseGeneratingEmbed(client, message, self);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`some-random-api\``
			);

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get(`https://some-random-api.ml/animu/wink`);
				const body = res.data;

				if (!body) {
					m.delete();

					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						`\`\`\`Error details: Invalid response from the API\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				} else {
					const imageEmbed = BaseImageEmbed(client, message, self)
						.setTitle(`Wink command`)
						.setDescription(`<@${message.author.id}> winks! ;)`)
						.setImage(body.link);

					m.delete();
					return message.channel.send(imageEmbed);
				}
			} catch (e) {
				m.delete();
				console.log(e);

				const errEmbed = await BaseErrorEmbed(client, message, this);
				errEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
			}
		}
	}
};
