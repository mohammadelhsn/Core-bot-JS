const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	getLang,
	getString,
	capitalize,
} = require("../../utils/structures/functions");
const nl = require("nekos.life");
const neko = new nl();

module.exports = class FactCommand extends BaseCommand {
	constructor() {
		super(
			"fact",
			"facts",
			[],
			"(help)",
			"Sends a random fact",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["fact help` - Sends the help command"],
			["fact", "fact help"],
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
		const self = this;
		const lang = await getLang(message.guild.id, this.connection);

		if (args[0]) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
			generatingEmbed.setDescription(
				`${getString(lang, "unexpected_error")}: \`Nekos Life API\``
			);
			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await neko.sfw.fact();

				const embed = BaseEmbed(client, message, this).setDescription(
					`Fact: \`${res.fact}\``
				);

				m.delete();
				return message.channel.send(embed);
			} catch (e) {
				m.delete();
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")} \`\`\``
				);
				return message.channel.send(errorEmbed);
			}
		}
	}
};
