const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fun = require("fun-responses");
const {
	capitalize,
	getLang,
	getString,
	BaseEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");

module.exports = class RoastCommand extends BaseCommand {
	constructor() {
		super(
			"roast",
			"fun",
			[],
			"(help)",
			"Sends a nice roast for you",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["roast help` - Sends the help embed"],
			["roast", "roast help"],
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

		const gEmbed = await BaseGeneratingEmbed(client, message, this);
		gEmbed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
		);

		const m = await message.channel.send(gEmbed);

		try {
			const embed = BaseEmbed(client, message, self);
			embed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
			);
			embed.addField("Roast", `\`${await fun.roast()}\``);
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
