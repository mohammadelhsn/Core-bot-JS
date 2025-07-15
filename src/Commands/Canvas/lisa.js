const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const dig = require("discord-image-generation");
const { MessageAttachment } = require("discord.js");
const {
	BaseHelpEmbed,
	BaseGeneratingEmbed,
	BaseErrorEmbed,
	BaseEmbed,
	getString,
	getLang,
} = require("../../utils/structures/functions");

module.exports = class LisaCommand extends BaseCommand {
	constructor() {
		super(
			"lisa",
			"canvas",
			[],
			"<text || help>",
			"Make a presentation",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["lisa help`"],
			["lisa help", "lisa welcome to my ted talk"],
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

		if (args[0]) {
			if (args[0].toLowerCase() == "help") {
				return await BaseHelpEmbed(client, message, self);
			} else {
				const gEmbed = await BaseGeneratingEmbed(client, message, self);
				gEmbed.setDescription(
					`${getString(lang, "provided_by")}: \`Discord-image-generation\``
				);

				const m = await message.channel.send(gEmbed);
				try {
					const image = await new dig.LisaPresentation().getImage(
						`${args.join(" ")}`
					);

					const attachment = new MessageAttachment(
						image,
						"lisa_presentation.png"
					);
					m.delete();
					return message.channel.send(attachment);
				} catch (e) {
					m.delete();
					console.log(e);

					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription(
						"```Error details: An unexpected error has occurred```"
					);
					return message.channel.send(errEmbed);
				}
			}
		} else {
			let timedOut = false;

			const isFromAuthor = (m) => m.author.id == message.author.id;

			const options = {
				max: 1,
				time: 60000,
			};

			const tEmbed = BaseEmbed(client, message, this).setDescription(
				`Please specify some text.`
			);
			await message.channel.send(tEmbed);

			const firstColl = await message.channel.awaitMessages(
				isFromAuthor,
				options
			);

			if (firstColl.size > 0) {
				const gEmbed = await BaseGeneratingEmbed(client, message, self);
				gEmbed.setDescription(
					`${getString(lang, "provided_by")}: \`Discord-image-generation\``
				);

				const m = await message.channel.send(gEmbed);
				try {
					const attach = firstColl.first().content;

					const img = await new dig.LisaPresentation().getImage(`${attach}`);
					const attachment = new MessageAttachment(
						img,
						"lisa_presentation.png"
					);
					m.delete();
					return message.channel.send(attachment);
				} catch (e) {
					m.delete();
					console.log(e);

					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription(
						"```Error details: An unexpected error has occurred```"
					);
					return message.channel.send(errEmbed);
				}
			} else {
				timedOut = true;
			}

			if (timedOut == true) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription("```Error details: Timed out```");
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
		}
	}
};
