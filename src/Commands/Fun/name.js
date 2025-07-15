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

module.exports = class NameCommand extends BaseCommand {
	constructor() {
		super(
			"name",
			"fun",
			[],
			"(help)",
			"Generates a name, just for you :)",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["name help` - Sends the help embed"],
			["name", "name help"],
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
		}

		const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
		generatingEmbed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`Nekos Life API\``
		);

		const m = await message.channel.send(generatingEmbed);
		try {
			const res = await axios.get(`https://nekos.life/api/v2/name`);
			const body = res.data;

			const avatarEmbed = BaseEmbed(client, message, this).setDescription(
				`Your name is: \`${body.name}\``
			);

			m.delete();
			return message.channel.send(avatarEmbed);
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
