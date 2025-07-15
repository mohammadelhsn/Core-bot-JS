const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseEmbed,
	BaseImageEmbed,
	BaseSuccessEmbed,
	BaseGeneratingEmbed,
	getString,
	getLang,
} = require("../../utils/structures/functions");
const fetch = require("node-fetch");
const { MessageAttachment } = require("discord.js");

module.exports = class WhoWouldWinCommand extends BaseCommand {
	constructor() {
		super(
			"whowouldwin",
			"canvas",
			[],
			"(mention) (mention2)",
			"Who would win?",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["whowouldwin help` - Sends the help command"],
			["whowouldwin", "whowouldwin @Core @Tech", "whowouldwin help"],
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
			gEmbed.setDescription("Provided by: `NekoBot API`");

			const m = await message.channel.send(gEmbed);
			try {
				const res = await fetch(
					encodeURI(
						`https://nekobot.xyz/api/imagegen?type=whowouldwin&user1=${user1}&user2=${user2}`
					)
				);
				const data = await res.json();
				const attachment = new MessageAttachment(
					data.message,
					"whowouldwin.png"
				);
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
		} else if (message.mentions.members.size == 1) {
			const member1 = message.mentions.members
				.first()
				.user.displayAvatarURL({ format: "png" });
			const member2 = message.member.user.displayAvatarURL({ format: "png" });

			const gEmbed = await BaseGeneratingEmbed(client, message, self);
			gEmbed.setDescription("Provided by: `NekoBot API`");

			const m = await message.channel.send(gEmbed);
			try {
				const res = await fetch(
					encodeURI(
						`https://nekobot.xyz/api/imagegen?type=whowouldwin&user1=${member1}&user2=${member2}`
					)
				);
				const data = await res.json();
				const attachment = new MessageAttachment(
					data.message,
					"whowouldwin.png"
				);
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
				if (firstColl.first().attachments.size <= 0) {
					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription(
						`\`\`\`Error details: Provided message is not an attachment\`\`\``
					);
					const msg = await message.channel.send(errEmbed);
					return msg.delete({ timeout: 10000 });
				}
				const attach = firstColl.first().attachments.first().url;

				const dEmbed = BaseEmbed(client, message, this).setDescription(
					`Please send the second image`
				);

				await message.channel.send(dEmbed);
				const secondColl = await message.channel.awaitMessages(
					isFromAuthor,
					options
				);

				if (secondColl.size > 0) {
					if (secondColl.first().attachments.size <= 0) {
						const errEmbed = await BaseErrorEmbed(client, message, self);
						errEmbed.setDescription(
							`\`\`\`Error details: Provided message is not an attachment\`\`\``
						);
						const msg = await message.channel.send(errEmbed);
						return msg.delete({ timeout: 10000 });
					}
					const attach2 = secondColl.first().attachments.first().url;

					const gEmbed = await BaseGeneratingEmbed(client, message, self);
					gEmbed.setDescription("Provided by: `NekoBot API`");

					const m = await message.channel.send(gEmbed);
					try {
						const res = await fetch(
							encodeURI(
								`https://nekobot.xyz/api/imagegen?type=whowouldwin&user1=${attach}&user2=${attach2}`
							)
						);
						const data = await res.json();
						const attachment = new MessageAttachment(
							data.message,
							"whowouldwin.png"
						);
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
