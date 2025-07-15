const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const dig = require("discord-image-generation");
const { MessageAttachment } = require("discord.js");
const {
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseEmbed,
	BaseImageEmbed,
	BaseSuccessEmbed,
	BaseGeneratingEmbed,
	getLang,
	getString,
} = require("../../utils/structures/functions");

module.exports = class BedCommand extends BaseCommand {
	constructor() {
		super(
			"bed",
			"canvas",
			[],
			"(mention || help) (mention2)",
			"Mum there's a monster under my bed...",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["bed help` - Sends the help command"],
			["bed", "bed @Core @Tech", "bed help"],
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
		if (message.mentions.members.size == 2) {
			const user1 = message.mentions.members
				.first()
				.user.displayAvatarURL({ format: "png" });
			const user2 = message.mentions.members
				.last()
				.user.displayAvatarURL({ format: "png" });

			const gEmbed = await BaseGeneratingEmbed(client, message, self);
			gEmbed.setDescription(
				`${getString(lang, "provided_by")}: \`Discord-image-generation\``
			);

			const m = await message.channel.send(gEmbed);
			try {
				const image = await new dig.Bed().getImage(`${user1}`, `${user2}`);
				const attachment = new MessageAttachment(image, "bed.png");
				m.delete();
				return message.channel.send(attachment);
			} catch (e) {
				m.delete();
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
				return message.channel.send(errorEmbed);
			}
		} else if (message.mentions.members.size == 1) {
			const member1 = message.mentions.members
				.first()
				.user.displayAvatarURL({ format: "png" });
			const member2 = message.member.user.displayAvatarURL({ format: "png" });

			const gEmbed = await BaseGeneratingEmbed(client, message, self);
			gEmbed.setDescription(
				`${getString(lang, "provided_by")}: \`Discord-image-generation\``
			);

			const m = await message.channel.send(gEmbed);
			try {
				const image = await new dig.Bed().getImage(`${member2}`, `${member1}`);
				const attachment = new MessageAttachment(image, "bed.png");
				m.delete();
				return message.channel.send(attachment);
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
		if (args[0]) {
			if (args[0].toLowerCase() == "help") {
				return await BaseHelpEmbed(client, message, self);
			}
		} else {
			// await messages
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
						`${getString(lang, "provided_by")}: \`Discord-image-generation\``
					);

					const m = await message.channel.send(gEmbed);
					try {
						const image = await new dig.Bed().getImage(
							`${attach}`,
							`${attach2}`
						);
						const attachment = new MessageAttachment(image, "bed.png");
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
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
		}
	}
};
