const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseEmbed,
	getLang,
	getString,
	capitalize,
} = require("../../utils/structures/functions");
const nl = require("nekos.life");
const neko = new nl();

module.exports = class OwOCommand extends BaseCommand {
	constructor() {
		super(
			"owo",
			"fun",
			[],
			"<text>",
			"OwOify's your text",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["owo help"],
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
		const text = args.join(" ");

		if (!text) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: You must include some text```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const gEmbed = await BaseGeneratingEmbed(client, message, self);
		gEmbed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`Nekos life API\``
		);

		const m = await message.channel.send(gEmbed);

		try {
			const res = await neko.sfw.OwOify({ text: text });
			m.delete();
			const embed = BaseEmbed(client, message, self);
			embed.setDescription(`Text: \`${res.owo}\``);
			return message.channel.send(embed);
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
};
