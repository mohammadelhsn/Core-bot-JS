const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
const axios = require("axios");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	getString,
	getLang,
	capitalize,
} = require("../../utils/structures/functions");

module.exports = class WhaleFactCommand extends BaseCommand {
	constructor() {
		super(
			"whalefact",
			"facts",
			[],
			"(help)",
			"Sends a fact about whales",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["whalefact help` - Sends the help command"],
			["whalefact", "whalefact help"],
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
		// Endpoint: https://some-random-api.ml/facts/whale

		if (args[0]) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`some-random-api\``
			);
			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get(`https://some-random-api.ml/facts/whale`);
				const body = res.data;

				const factEmbed = BaseEmbed(client, message, this).setDescription(
					`Fact: \`${body.fact}\``
				);

				m.delete();
				return message.channel.send(factEmbed);
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
