const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
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
const { MessageAttachment } = require("discord.js");

module.exports = class CaptchaCommand extends BaseCommand {
	constructor() {
		super(
			"captcha",
			"canvas",
			[],
			"<help || me || @mention> <message to display> ",
			"Applies your picture as the captcha picture",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["captcha help` - Sends the help command"],
			["captcha me", "captcha help", "captcha @Tech!", "captcha (attachment)"],
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
		const self = this;
		let text = args.slice(1).join(" ");

		if (message.mentions.members.size == 1) {
			const user = message.mentions.members.first();
			if (!text || text.length == 0) text = user.user.username;
			const icon = user.user.displayAvatarURL({ format: "png" });
			const gEmbed = await BaseGeneratingEmbed(client, message, self);
			gEmbed.setDescription("Provided by: `NekoBot API`");

			const m = await message.channel.send(gEmbed);
			try {
				const res = await axios.get(
					encodeURI(
						`https://nekobot.xyz/api/imagegen?type=captcha&url=${icon}&username=${text}`
					)
				);
				const data = res.data;
				const attachment = new MessageAttachment(data.message, "captcha.png");
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
		} else if (message.mentions.members.size == 0 && args[0] == "me") {
			const user = message.member;
			if (!text || text.length == 0) text = user.user.username;
			const icon = user.user.displayAvatarURL({ format: "png" });
			const gEmbed = await BaseGeneratingEmbed(client, message, self);
			gEmbed.setDescription("Provided by: `NekoBot API`");

			const m = await message.channel.send(gEmbed);
			try {
				const res = await axios.get(
					encodeURI(
						`https://nekobot.xyz/api/imagegen?type=captcha&url=${icon}&username=${text}`
					)
				);
				const data = res.data;
				const attachment = new MessageAttachment(data.message, "captcha.png");
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
				const attach = firstColl.first().attachments.first().url;

				const dEmbed = BaseEmbed(client, message, this).setDescription(
					`Please reply with some text.`
				);

				await message.channel.send(dEmbed);
				const secondColl = await message.channel.awaitMessages(
					isFromAuthor,
					options
				);

				if (secondColl.size > 0) {
					const attach2 = secondColl.first().content;
					const gEmbed = await BaseGeneratingEmbed(client, message, self);
					gEmbed.setDescription("Provided by: `NekoBot API`");

					const m = await message.channel.send(gEmbed);
					try {
						const res = await axios.get(
							encodeURI(
								`https://nekobot.xyz/api/imagegen?type=captcha&url=${attach}&username=${attach2}`
							)
						);
						const data = res.data;
						const attachment = new MessageAttachment(
							data.message,
							"captcha.png"
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
