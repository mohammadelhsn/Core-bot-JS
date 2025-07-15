const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseGeneratingEmbed,
	BaseErrorEmbed,
	capitalize,
	getString,
	getLang,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");
const { MessageAttachment } = require("discord.js");
const axios = require("axios");

module.exports = class CrapCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"crap",
			"canvas",
			["shit"],
			"(mention || help) (mention2)",
			"",
			"",
			[],
			[],
			[],
			true,
			1000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		// api.no-api-key.com/api/v2/crap?stepped&stepper=
		// https://api.no-api-key.com/api/v2/crap?stepped=${stepped}&stepper=${stepper1}
		const lang = await getLang(message.guild.id, this.connection);
		const self = this;

		if (message.mentions.members.size == 2) {
			const avatar1 = message.mentions.members
				.first()
				.user.displayAvatarURL({ format: "png" });
			const avatar2 = message.mentions.members
				.last()
				.user.displayAvatarURL({ format: "png" });

			const gEmbed = await BaseGeneratingEmbed(client, message, self);
			gEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
			);

			const m = await message.channel.send(gEmbed);

			try {
				const link = `https://api.no-api-key.com/api/v2/crap?stepped=${avatar1}&stepper=${avatar2}`;
				const attachment = new MessageAttachment(link, "crap.png");
				m.delete();
				return message.channel.send(attachment);
			} catch (e) {
				m.delete();
				console.log(e);

				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
				return message.channel.send(errEmbed);
			}
		} else if (message.mentions.members.size == 1) {
			const avatar1 = message.mentions.members
				.first()
				.user.displayAvatarURL({ format: "png" });
			const avatar2 = message.author.displayAvatarURL({ format: "png" });

			const gEmbed = await BaseGeneratingEmbed(client, message, self);
			gEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
			);

			const m = await message.channel.send(gEmbed);

			try {
				const link = `https://api.no-api-key.com/api/v2/crap?stepped=${avatar1}&stepper=${avatar2}`;
				const attachment = new MessageAttachment(link, "crap.png");
				m.delete();
				return message.channel.send(attachment);
			} catch (e) {
				m.delete();
				console.log(e);

				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
				return message.channel.send(errEmbed);
			}
		}
		if (args[0]) {
			if (args[0].toLowerCase() == "help") {
				return await BaseHelpEmbed(client, message, self);
			}
		} else {
			let timedOut = false;

			const isFromAuthor = (m) => m.author.id == message.author.id;

			const options = {
				max: 1,
				time: 60000,
			};

			const tEmbed = BaseEmbed(client, message, this).setDescription(
				`Please send the first image`
			);
			await message.channel.send(tEmbed);

			const firstColl = await message.channel.awaitMessages(
				isFromAuthor,
				options
			);

			if (firstColl.size > 0) {
				const attach = firstColl.first().attachments.first().url;

				const dEmbed = BaseEmbed(client, message, this).setDescription(
					`Please second the second image`
				);

				await message.channel.send(dEmbed);
				const secondColl = await message.channel.awaitMessages(
					isFromAuthor,
					options
				);

				if (secondColl.size > 0) {
					const attach2 = secondColl.first().attachments.first().url;

					const gEmbed = await BaseGeneratingEmbed(client, message, self);
					gEmbed.setDescription(
						`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
					);

					const m = await message.channel.send(gEmbed);
					try {
						const link = `https://api.no-api-key.com/api/v2/crap?stepped=${attach}&stepper=${attach2}`;
						const attachment = new MessageAttachment(link, "crap.png");
						m.delete();
						return message.channel.send(attachment);
					} catch (e) {
						m.delete();
						console.log(e);

						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription(
							`\`\`\`Error details: ${getString(
								lang,
								"unexpected_error"
							)}\`\`\``
						);
						return message.channel.send(errorEmbed);
					}
				} else {
					timedOut = true;
				}
			} else {
				timedOut = true;
			}

			if (timedOut === true) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription("```Error details: Timed out```");
				return message.channel.send(errorEmbed);
			}
		}
	}
};
