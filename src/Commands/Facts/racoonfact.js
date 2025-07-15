const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
const axios = require("axios");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	getLang,
	getString,
	capitalize,
} = require("../../utils/structures/functions");

module.exports = class RacoonFactCommand extends BaseCommand {
	constructor() {
		super(
			"racoonfact",
			"facts",
			[],
			"(help)",
			"Sends a fact about racoons",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["racoonfact help` - Sends the help command"],
			["racoonfact", "racoonfact help"],
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
		// Endpoint: https://some-random-api.ml/facts/racoon

		if (args[0]) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`some-random-api\``
			);
			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get(`https://some-random-api.ml/facts/racoon`);
				const body = res.data;

				if (!body) {
					m.delete();

					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						`\`\`\`Error details: Invalid response from the API\`\`\``
					);
					return message.channel.send(errorEmbed);
				} else {
					const factEmbed = BaseEmbed(client, message, this).setDescription(
						`Fact: \`${body.fact}\``
					);

					m.delete();
					return message.channel.send(factEmbed);
				}
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
