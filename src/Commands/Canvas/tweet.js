const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseGeneratingEmbed,
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseImageEmbed,
	BaseEmbed,
	getLang,
	getString,
} = require("../../utils/structures/functions");
const axios = require("axios");
const fetch = require("node-fetch");
const { MessageAttachment } = require("discord.js");

module.exports = class TweetCommand extends BaseCommand {
	constructor() {
		super(
			"tweet",
			"canvas",
			[],
			"(help)",
			"Make a fake tweet",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["tweet help`"],
			["tweet", "tweet help"],
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
				"Please mention someone / say me for a username "
			);
			await message.channel.send(tEmbed);

			const firstColl = await message.channel.awaitMessages(
				isFromAuthor,
				options
			);

			if (firstColl.size > 0) {
				let username;
				if (firstColl.first().content.length > 0) {
					if (firstColl.first().content.toLowerCase() == "me") {
						username = message.author.username;
					}
				}
				if (firstColl.first().mentions.members.size > 0) {
					username = firstColl.first().mentions.members.first().user.username;
				}

				const dEmbed = BaseEmbed(client, message, this).setDescription(
					`Please mention the text for the comment.`
				);

				await message.channel.send(dEmbed);
				const secondColl = await message.channel.awaitMessages(
					isFromAuthor,
					options
				);

				if (secondColl.size > 0) {
					const comment = secondColl.first().content;

					if (comment.toLowerCase() === "cancel") {
						const embed = await BaseSuccessEmbed(client, message, self);
						embed.setDescription(`Successfully cancelled section!`);
						return message.channel.send(embed);
					}

					const gEmbed = await BaseGeneratingEmbed(client, message, self);
					gEmbed.setDescription("Provided by: `NekoBot API`");

					const m = await message.channel.send(gEmbed);
					try {
						const res = await axios.get(
							encodeURI(
								`https://nekobot.xyz/api/imagegen?type=tweet&username=${username}&text=${comment}`
							)
						);
						const body = res.data;

						const attachment = new MessageAttachment(body.message, "tweet.png");
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
				} else timedOut = true;
			} else timedOut = true;

			if (timedOut == true) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription("```Error details: Command timed out```");
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
		}
	}
};
