const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
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

module.exports = class CatTextCommand extends BaseCommand {
	constructor() {
		super(
			"cattext",
			"fun",
			[],
			"(help)",
			"Generates random cat text for you.",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["cattext help` - Sends the help embed"],
			["cattext", "cattext help"],
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
		} else {
			const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`Nekos life API\``
			);
			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await neko.sfw.catText();

				const cattextembed = BaseEmbed(client, message, this)
					.setTitle(`Cat text command`)
					.setDescription(`Cat text: ${res.cat}`);

				m.delete();
				return message.channel.send(cattextembed);
			} catch (e) {
				m.delete();
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpeted_error")}`
				);
				return message.channel.send(errorEmbed);
			}
		}
	}
};
