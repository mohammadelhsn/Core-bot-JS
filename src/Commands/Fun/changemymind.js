const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
const axios = require("axios");
const { MessageAttachment } = require("discord.js");
const {
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	getString,
	getLang,
	capitalize,
} = require("../../utils/structures/functions");

module.exports = class ChangeMyMindCommand extends BaseCommand {
	constructor() {
		super(
			"changemymind",
			"fun",
			[],
			"<text>",
			"Applies given text to the change my mind picture",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["changemymind Core is cool"],
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
		const text = args.join(" ");

		if (!text) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: You need some text to add.\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
		generatingEmbed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`NekoBot API\``
		);
		const m = await message.channel.send(generatingEmbed);
		try {
			const res = await axios.get(
				encodeURI(
					`https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`
				)
			);
			const data = res.data;

			const attachment = new MessageAttachment(
				data.message,
				"changemymind.png"
			);

			m.delete();
			return message.channel.send(attachment);
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
