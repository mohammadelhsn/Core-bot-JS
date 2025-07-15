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

module.exports = class WantedCommand extends BaseCommand {
	constructor() {
		super(
			"wanted",
			"canvas",
			[],
			"(mention || help) (currency)",
			"You're wanted. Reward available",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["wanted help`"],
			["wanted", "wanted @Core $", "wanted help"],
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

		if (mention) {
			const currency = args[1];

			if (!currency) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: Please mention a currency\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
			const avatar = message.mentions.members
				.first()
				.user.displayAvatarURL({ format: "png" });
			const gEmbed = await BaseGeneratingEmbed(client, message, self);
			gEmbed.setDescription(
				`${getString(lang, "provided_by")}: \`Discord-image-generation\``
			);

			const m = await message.channel.send(gEmbed);
			try {
				const image = await new dig.Wanted().getImage(
					`${avatar}`,
					`${currency}`
				);
				const attachment = new MessageAttachment(image, "wanted.png");
				m.delete();
				return message.channel.send(attachment);
			} catch (e) {
				m.delete();
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```Error details: An unexpected error has occurred```"
				);
				return message.channel.send(errorEmbed);
			}
		} else if (args[0] == "me") {
			const currency = args[1];

			if (!currency) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: Please mention a currency\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
			const gEmbed = await BaseGeneratingEmbed(client, message, self);
			gEmbed.setDescription(
				`${getString(lang, "provided_by")}: \`Discord-image-generation\``
			);

			const m = await message.channel.send(gEmbed);
			try {
				const avatar = message.author.displayAvatarURL({ format: "png" });
				const image = await new dig.Wanted().getImage(
					`${avatar}`,
					`${currency}`
				);
				const attachment = new MessageAttachment(image, "wanted.png");
				m.delete();
				return message.channel.send(attachment);
			} catch (e) {
				m.delete();
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```Error details: An unexpected error has occurred```"
				);
				return message.channel.send(errorEmbed);
			}
		} else if (args[0] == "help") {
			return await BaseHelpEmbed(client, message, self);
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
				if (firstColl.first().attachments.size <= 0) {
					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						"```Error details: Must be an attachment```"
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}
				const attach = firstColl.first().attachments.first().url;

				const dEmbed = BaseEmbed(client, message, this).setDescription(
					`Please mention a currency`
				);

				await message.channel.send(dEmbed);
				const secondColl = await message.channel.awaitMessages(
					isFromAuthor,
					options
				);

				if (secondColl.size > 0) {
					const attach2 = secondColl.first().content;

					const gEmbed = await BaseGeneratingEmbed(client, message, self);
					gEmbed.setDescription(
						`${getString(lang, "provided_by")}: \`Discord-image-generation\``
					);

					const m = await message.channel.send(gEmbed);
					try {
						const image = await new dig.Wanted().getImage(
							`${attach}`,
							`${attach2}`
						);
						const attachment = new MessageAttachment(image, "wanted.png");
						m.delete();
						return message.channel.send(attachment);
					} catch (e) {
						m.delete();
						console.log(e);

						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription(
							"```Error details: An unexpected error has occurred```"
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
