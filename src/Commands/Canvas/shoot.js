const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	capitalize,
	getLang,
	getString,
	BaseEmbed,
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseGeneratingEmbed,
} = require("../../utils/structures/functions");
const { MessageAttachment } = require("discord.js");

module.exports = class ShootCommand extends BaseCommand {
	constructor() {
		super(
			"shoot",
			"canvas",
			[],
			"",
			"",
			"",
			[],
			"",
			"",
			true,
			3000,
			false,
			false,
			[],
			"WIP"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const lang = await getLang(message.guild.id, this.connection);
		const self = this;
		// https://api.no-api-key.com/api/v2/shoot?image=

		const mention = message.mentions.members.first();

		if (args[0]) {
			if (args[0].toLowerCase() == "help") {
				return await BaseHelpEmbed(client, message, self);
			} else if (mention) {
				const gEmbed = await BaseGeneratingEmbed(client, message, self);
				gEmbed.setDescription(
					`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
				);

				const m = await message.channel.send(gEmbed);

				try {
					const avatar = mention.user.displayAvatarURL({ format: "png" });
					const link = `https://api.no-api-key.com/api/v2/shoot?image=${avatar}`;
					const attachment = new MessageAttachment(link, "shoot.png");

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
			} else if (args[0].toLowerCase() == "me") {
				const gEmbed = await BaseGeneratingEmbed(client, message, self);
				gEmbed.setDescription(
					`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
				);

				const m = await message.channel.send(gEmbed);

				try {
					const avatar = message.author.displayAvatarURL({ format: "png" });
					const link = `https://api.no-api-key.com/api/v2/shoot?image=${avatar}`;
					const attachment = new MessageAttachment(link, "shoot.png");

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
		} else {
			if (message.attachments.size > 0) {
				const gEmbed = await BaseGeneratingEmbed(client, message, self);
				gEmbed.setDescription(
					`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
				);

				const m = await message.channel.send(gEmbed);

				try {
					const avatar = message.attachments.first().url;
					const link = `https://api.no-api-key.com/api/v2/shoot?image=${avatar}`;
					const attachment = new MessageAttachment(link, "shoot.png");

					m.delete();
					return message.channel.send(attachment);
				} catch (e) {
					m.delete();
					console.log(e);

					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription(
						`\`\`\`Error details: ${getString(lang, "uenxpected_error")}\`\`\``
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
					gEmbed.setDescription(
						`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
					);

					const m = await message.channel.send(gEmbed);
					try {
						const avatar = firstColl.first().attachments.first().url;
						const link = `https://api.no-api-key.com/api/v2/shoot?image=${avatar}`;
						const attachment = new MessageAttachment(link, "shoot.png");
						m.delete();
						return message.channel.send(attachment);
					} catch (e) {
						m.delete();
						console.log(e);

						const errEmbed = await BaseErrorEmbed(client, message, self);
						errEmbed.setDescription(
							`\`\`\`Error details: ${getString(
								lang,
								"unexpected_error"
							)}\`\`\``
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
	}
};
