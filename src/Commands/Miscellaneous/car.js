const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const axios = require("axios");
const {
	capitalize,
	getLang,
	getString,
	BaseImageEmbed,
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseGeneratingEmbed,
} = require("../../utils/structures/functions");

module.exports = class CarCommand extends BaseCommand {
	constructor() {
		super(
			"car",
			"miscellaneous",
			[],
			"(help)",
			"Sends a picture of a car",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["car help` - Sends the help embed"],
			["car", "car help"],
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
		}

		const gEmbed = await BaseGeneratingEmbed(client, message, self);
		gEmbed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
		);

		const m = await message.channel.send(gEmbed);

		try {
			const res = await axios.get(`https://no-api-key.com/api/v1/car`);
			const body = res.data;

			const embed = BaseImageEmbed(client, message, self);
			embed.setTitle("Car command");
			embed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
			);
			embed.setImage(body.image);
			m.delete();
			return message.channel.send(embed);
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
};
