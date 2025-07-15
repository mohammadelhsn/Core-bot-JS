const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
const { MessageAttachment } = require("discord.js");
const axios = require("axios");
const {
	BaseErrorEmbed,
	BaseImageEmbed,
	BaseGeneratingEmbed,
	BaseHelpEmbed,
	getLang,
	getString,
} = require("../../utils/structures/functions");

module.exports = class ClydeCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"clyde",
			"canvas",
			[],
			"<text || help>",
			"Clyde says whatever you provide",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["clyde help` - Sends the help command"],
			["clyde hello I'm clyde! Core is my best friend", "clyde help"],
			true,
			5000,
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
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: You need some text to add.\`\`\``
			);
			return message.channel.send(errorEmbed);
		}
		if (text.toLowerCase() == "help") {
			return await BaseHelpEmbed(client, message, self);
		}
		const gEmbed = await BaseGeneratingEmbed(client, message, self);
		gEmbed.setDescription(
			`${getString(lang, "provided_by")}: \`Discord-image-generation\``
		);

		const m = await message.channel.send(gEmbed);
		try {
			const res = await axios.get(
				encodeURI(`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`)
			);
			const data = res.data;
			const attachment = new MessageAttachment(data.message, "clyde.png");
			const imageEmbed = BaseImageEmbed(client, message, this)
				.setTitle(`Clyde command`)
				.setDescription(`Provided by: \`Nekobot API\``)
				.setImage(`attachment://clyde.png`);
			m.delete();
			return message.channel.send({ files: [attachment], embed: imageEmbed });
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
