const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
const { MessageAttachment } = require("discord.js");
const {
	BaseGeneratingEmbed,
	BaseImageEmbed,
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseEmbed,
	getString,
	getLang,
} = require("../../utils/structures/functions");

module.exports = class GayCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"gay",
			"canvas",
			[],
			"<help || me || @mention || attachment>",
			"Applies a rainbow over the given picture",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["gay help` - Sends the help command"],
			["gay me", "gay help", "gay @Tech!", "gay (attachment)"],
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
		const mention = message.mentions.members.first();
		if (args[0]) {
			if (args[0].toLowerCase() == "help") {
				return await BaseHelpEmbed(client, message, self);
			} else if (mention) {
				const gEmbed = await BaseGeneratingEmbed(client, message, self);
				gEmbed.setDescription("Provided by: `Some-random-api`");

				const m = await message.channel.send(gEmbed);
				try {
					const avatar = mention.user.displayAvatarURL({ format: "png" });
					const link = `https://some-random-api.ml/canvas/gay/?avatar=${avatar}`;
					const attachment = new MessageAttachment(link, "gay.png");
					m.delete();
					return message.channel.send(attachment);
				} catch (e) {
					m.delete();
					console.log(e);

					const eEmbed = await BaseErrorEmbed(client, message, self);
					eEmbed.setDescription(
						"```Error details: An unexpected error has occurred```"
					);
					return message.channel.send(eEmbed);
				}
			} else if (args[0].toLowerCase() == "me") {
				const gEmbed = await BaseGeneratingEmbed(client, message, self);
				gEmbed.setDescription("Provided by: `Some-random-api`");

				const m = await message.channel.send(gEmbed);
				try {
					const avatar = message.author.displayAvatarURL({ format: "png" });
					const link = `https://some-random-api.ml/canvas/gay/?avatar=${avatar}`;
					const attachment = new MessageAttachment(link, "gay.png");
					m.delete();
					return message.channel.send(attachment);
				} catch (e) {
					console.log(e);
					m.delete();

					const eEmbed = await BaseErrorEmbed(client, message, self);
					eEmbed.setDescription(
						"```Error details: An unexpected error has occurred```"
					);
					return message.channel.send(eEmbed);
				}
			}
		} else if (message.attachments.size > 0) {
			const gEmbed = await BaseGeneratingEmbed(client, message, self);
			gEmbed.setDescription("Provided by: `Some-random-api`");

			const m = await message.channel.send(gEmbed);
			try {
				const img = message.attachments.first().url;
				const link = `https://some-random-api.ml/canvas/gay/?avatar=${img}`;
				const attachment = new MessageAttachment(link, "gay.png");
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
			let timedOut = false;

			const isFromAuthor = (m) => m.author.id == message.author.id;

			const options = {
				max: 1,
				time: 60000,
			};

			const tEmbed = BaseEmbed(client, message, this).setDescription(
				`Please send the first image you want.`
			);
			await message.channel.send(tEmbed);

			const firstColl = await message.channel.awaitMessages(
				isFromAuthor,
				options
			);

			if (firstColl.size > 0) {
				const gEmbed = await BaseGeneratingEmbed(client, message, self);
				gEmbed.setDescription("Provided by: `Some-random-api`");

				const m = await message.channel.send(gEmbed);
				try {
					const attach = firstColl.first().attachments.first().url;
					const link = `https://some-random-api.ml/canvas/gay/?avatar=${attach}`;
					const attachment = new MessageAttachment(link, "gay.png");
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
				return message.channel.send(errorEmbed);
			}
		}
	}
};
