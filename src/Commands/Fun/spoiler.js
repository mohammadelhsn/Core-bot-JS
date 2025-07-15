const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseGeneratingEmbed,
	BaseImageEmbed,
	BaseErrorEmbed,
} = require("../../utils/structures/functions");
const nl = require("nekos.life");
const neko = new nl();

module.exports = class SpoilerCommand extends BaseCommand {
	constructor() {
		super(
			"spoiler",
			"fun",
			[],
			"<text>",
			"Applies spoilers in between every single letter",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["spoiler help` - Sends the help embed"],
			["spoiler hello there"],
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
		gEmbed.setDescription("Provided by: `Nekos Life API`");

		const m = await message.channel.send(gEmbed);

		try {
			const res = await neko.sfw.spoiler({ text: text });
			m.delete();
			const embed = BaseEmbed(client, message, self).setDescription(
				`Text: ${res.owo}\nCopy text: \`${res.owo}\``
			);
			return message.channel.send(embed);
		} catch (e) {
			m.delete();
			console.log(e);

			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: An unexpected error has occurred```"
			);
			return message.channel.send(errorEmbed);
		}
	}
};
