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

module.exports = class JokeComamnd extends BaseCommand {
	constructor() {
		super(
			"joke",
			"fun",
			[],
			"(help)",
			"Sends a random joke.",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["joke help` - Sends the help embed"],
			["joke", "joke help"],
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
		// Endpoint: https://some-random-api.ml/joke

		if (args[0]) {
			return await BaseHelpEmbed(client, message, this);
		}

		const gEmbed = await BaseGeneratingEmbed(client, message, this);
		gEmbed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`some-random-api\``
		);
		const m = await message.channel.send(gEmbed);

		try {
			const res = await axios.get(`https://some-random-api.ml/joke`);
			const body = res.data;

			const embed = BaseEmbed(client, message, this).setDescription(
				`Joke: \`${body.joke}\``
			);
			return message.channel.send(embed);
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
};
