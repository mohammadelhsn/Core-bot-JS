const BaseCommand = require("../../utils/structures/BaseCommand");
const { MessageAttachment } = require("discord.js");
const dig = require("discord-image-generation");

module.exports = class AdCommand extends BaseCommand {
	constructor() {
		super(
			"ad",
			"canvas",
			[],
			"(help || me || @mention || attachment)",
			"Sends a your provided picture into an ad",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["ad help` - Sends the help command"],
			["ad me", "ad help", "ad @Tech!", "ad (attachment)"],
			true,
			5000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		const lang = await this.Translator.getLang(message.guild.id);

		const self = this;
		const mention = message.mentions.members.first();
		if (args[0]) {
			if (args[0].toLowerCase() == "help") {
				return await this.HelpEmbed.Base({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					command: this,
					message: message,
				});
			} else if (mention) {
				const gEmbed = await this.GeneratingEmbed.DiscordIG({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					command: this,
					id: message.guild.id,
				});
				const m = await message.channel.send(gEmbed);
				try {
					const avatar = mention.user.displayAvatarURL({ format: "png" });
					const image = await new dig.Ad().getImage(`${avatar}`);
					const attachment = new MessageAttachment(image, "ad.png");
					m.delete();

					const embed = await this.ImageEmbed.Base({
						client: client,
						iconURL: avatar,
						id: message.guild.id,
						command: this,
						title: "Ad command",
						description: `${this.Utils.capitalize(
							this.Translator.getString(lang, "provided_by")
						)}: \`Discord-image-generation\``,
						image: "attachment://ad.png",
					});

					return message.channel.send({ files: [attachment], embed: embed });
				} catch (e) {
					m.delete();
					console.log(e);

					const eEmbed = await this.ErrorEmbed.UnexpectedError({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						command: this,
					});
					return message.channel.send(eEmbed);
				}
			} else if (args[0].toLowerCase() == "me") {
				const gEmbed = await this.GeneratingEmbed.DiscordIG({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					command: this,
					id: message.guild.id,
				});

				const m = await message.channel.send(gEmbed);
				try {
					const avatar = message.author.displayAvatarURL({ format: "png" });
					const image = await new dig.Ad().getImage(`${avatar}`);
					const attachment = new MessageAttachment(image, "ad.png");
					m.delete();

					const embed = await this.ImageEmbed.Base({
						client: client,
						iconURL: avatar,
						id: message.guild.id,
						command: this,
						title: "Ad command",
						description: `${this.Utils.capitalize(
							this.Translator.getString(lang, "provided_by")
						)}: \`Discord-image-generation\``,
						image: "attachment://ad.png",
					});

					return message.channel.send({ files: [attachment], embed: embed });
				} catch (e) {
					m.delete();
					console.log(e);

					const eEmbed = await this.ErrorEmbed.UnexpectedError({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						command: this,
					});
					return message.channel.send(eEmbed);
				}
			}
		} else if (message.attachments.size > 0) {
			const gEmbed = await this.GeneratingEmbed.DiscordIG({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				id: message.guild.id,
			});

			const m = await message.channel.send(gEmbed);
			try {
				const image = await new dig.Ad().getImage(
					`${message.attachments.first().url}`
				);
				const attachment = new MessageAttachment(image, "ad.png");
				m.delete();

				const embed = await this.ImageEmbed.Base({
					client: client,
					iconURL: avatar,
					id: message.guild.id,
					command: this,
					title: "Ad command",
					description: `${this.Utils.capitalize(
						this.Translator.getString(lang, "provided_by")
					)}: \`Discord-image-generation\``,
					image: "attachment://ad.png",
				});

				return message.channel.send({ files: [attachment], embed: embed });
			} catch (e) {
				m.delete();
				console.log(e);

				const errEmbed = await this.ErrorEmbed.UnexpectedError({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: this,
				});
				return message.channel.send(errEmbed);
			}
		} else {
			let timedOut = false;

			const isFromAuthor = (m) => m.author.id == message.author.id;

			const options = {
				max: 1,
				time: 60000,
			};

			const tEmbed = await this.Embed.Base({
				client: client, 
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: "Ad command",
				description: `Please send the first image you want.`
			})
			await message.channel.send({ embed: tEmbed});

			const firstColl = await message.channel.awaitMessages(
				isFromAuthor,
				options
			);

			if (firstColl.size > 0) {
				const gEmbed = await this.GeneratingEmbed.DiscordIG({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					command: this,
					id: message.guild.id,
				});

				const m = await message.channel.send(gEmbed);
				try {
					m.delete();

					const attach = firstColl.first().attachments.first().url;
					const img = await new dig.Ad().getImage(`${attach}`);
					const attachment = new MessageAttachment(img, "ad.png");

					const embed = await this.ImageEmbed.Base({
						client: client,
						iconURL: avatar,
						id: message.guild.id,
						command: this,
						title: "Ad command",
						description: `${this.Utils.capitalize(
							this.Translator.getString(lang, "provided_by")
						)}: \`Discord-image-generation\``,
						image: "attachment://ad.png",
					});

					return message.channel.send({ files: [attachment], embed: embed });
				} catch (e) {
					m.delete();
					console.log(e);

					const errEmbed = await this.ErrorEmbed.UnexpectedError({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						command: this,
					});
					return message.channel.send(errEmbed);
				}
			} else {
				timedOut = true;
			}

			if (timedOut == true) {
				const errorEmbed = await this.ErrorEmbed.Base({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: this,
					error_message: "Timed out!",
				});
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
		}
	}
};
