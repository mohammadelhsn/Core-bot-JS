const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const { MessageAttachment } = require("discord.js");
const axios = require("axios");
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

module.exports = class PhCommentCommand extends BaseCommand {
	constructor() {
		super(
			"phcomment",
			"canvas",
			[],
			"",
			"Make a fake ph comment",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["phcomment` help"],
			["phcomment", "phcomment help"],
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
		// Endpoint: https://some-random-api.ml/canvas/youtube-comment/?avatar=&username=&comment=
		if (args[0]) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			let timedOut = false;

			const isFromAuthor = (m) => m.author.id == message.author.id;

			const options = {
				max: 1,
				time: 60000,
			};

			const tEmbed = BaseEmbed(client, message, this).setDescription(
				"Please mention someone / send an attachment / say me for an avatar"
			);
			await message.channel.send(tEmbed);

			const firstColl = await message.channel.awaitMessages(
				isFromAuthor,
				options
			);

			if (firstColl.size > 0) {
				let avatar;
				if (firstColl.first().content.length > 0) {
					if (firstColl.first().content.toLowerCase() == "me") {
						avatar = message.author.displayAvatarURL({ format: "png" });
					}
				}
				if (firstColl.first().mentions.members.size > 0) {
					avatar = firstColl
						.first()
						.mentions.members.first()
						.user.displayAvatarURL({ format: "png" });
				}
				if (firstColl.first().attachments.size > 0) {
					avatar = firstColl.first().attachments.first().url;
				}

				const dEmbed = BaseEmbed(client, message, this).setDescription(
					`Please mention the username you want for the comment`
				);

				await message.channel.send(dEmbed);
				const secondColl = await message.channel.awaitMessages(
					isFromAuthor,
					options
				);

				if (secondColl.size > 0) {
					const username = secondColl.first().content;

					if (username.toLowerCase() === "cancel") {
						const embed = await BaseSuccessEmbed(client, message, self);
						embed.setDescription(`Successfully cancelled section!`);
						return message.channel.send(embed);
					}
					if (username.length > 25) {
						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription(
							"```Error details: Text must be under 25 for username```"
						);
						const msg = await message.channel.send(errorEmbed);
						return msg.delete({ timeout: 10000 });
					}

					const cEmbed = BaseEmbed(client, message, this).setDescription(
						`Please mention some text for the comment`
					);
					await message.channel.send(cEmbed);
					const thridColl = await message.channel.awaitMessages(
						isFromAuthor,
						options
					);

					if (thridColl.size > 0) {
						const comment = thridColl.first().content;

						if (comment.toLowerCase() === "cancel") {
							const embed = await BaseSuccessEmbed(client, message, self);
							embed.setDescription(`Successfully cancelled section!`);
							return message.channel.send(embed);
						}

						if (comment.length > 1000) {
							const errorEmbed = await BaseErrorEmbed(client, message, self);
							errorEmbed.setDescription(
								"```Error details: Comment is too long. Must be under 1000 characters```"
							);
							const msg = await message.channel.send(errorEmbed);
							return msg.delete({ timeout: 10000 });
						}
						const gEmbed = await BaseGeneratingEmbed(client, message, self);
						gEmbed.setDescription("Provided by: `NekoBot API`");

						const m = await message.channel.send(gEmbed);
						try {
							const res = await axios.get(
								encodeURI(
									`https://nekobot.xyz/api/imagegen?type=phcomment&image=${avatar}&text=${comment}&username=${username}`
								)
							);
							const body = res.data;

							const attachment = new MessageAttachment(
								body.message,
								"baguette.png"
							);
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
					} else timeout = true;
				} else timedOut = true;
			} else timedOut = true;
		}
	}
};
