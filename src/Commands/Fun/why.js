const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	getString,
	getLang,
	capitalize,
} = require("../../utils/structures/functions");
const nl = require("nekos.life");
const neko = new nl();

module.exports = class WhyCommand extends BaseCommand {
	constructor() {
		super(
			"why",
			"fun",
			[],
			"(help)",
			"why",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["why help` - Sends the help embed"],
			["why", "why help"],
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
		if (args[0]) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`Nekos life API\``
			);

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await neko.sfw.why();

				const waifuEmbed = BaseEmbed(client, message, this)
					.setTitle(`Why command`)
					.setDescription(`\`${res.why}\``);

				m.delete();
				return message.channel.send(waifuEmbed);
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
