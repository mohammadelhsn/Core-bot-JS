const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const axios = require("axios");
const {
	getLang,
	capitalize,
	getString,
	BaseHelpEmbed,
	BaseGeneratingEmbed,
	BaseEmbed,
	BaseErrorEmbed,
} = require("../../utils/structures/functions");

module.exports = class BearFactCommand extends BaseCommand {
	constructor() {
		super(
			"bearfact",
			"facts",
			[],
			"(help)",
			"Sends you a bear fact",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["bearfact help` - Sends the help embed"],
			["bearfact", "bearfact help"],
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
			const res = await axios.get(`https://no-api-key.com/api/v1/animals/bear`);
			const body = await res.data;

			const embed = BaseEmbed(client, message, self)
				.setDescription(
					`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
				)
				.addField("Fact", `${body.fact}`);

			m.delete();
			return message.channel.send(embed);
		} catch (e) {
			m.delete();
			console.log(e);

			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: ${getString(lang, "unexpected_error")}`
			);
			return message.channel.send(errEmbed);
		}
	}
};
