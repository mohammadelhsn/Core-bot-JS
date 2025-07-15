const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseImageEmbed,
} = require("../../utils/structures/functions");
const axios = require("axios");
const pagination = require("discord.js-pagination");

module.exports = class CustomEmojiCommand extends BaseCommand {
	constructor() {
		super(
			"emojigg",
			"miscellaneous",
			[],
			"(category || query) (query) ",
			"Searches emoji.gg for custom emojis you can use",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["emojigg category` - Search emojis in a certain category"],
			["emojigg star wars", "emojigg category anime"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;

		const flags = {
			1: "Original Style",
			18: "Recolors",
			2: "TV / Movie",
			10: "Gaming",
			3: "Meme",
			4: "Anime",
			13: "Pepe",
			5: "Celebrity",
			6: "Blobs",
			7: "Thinking",
			17: "Animals",
			15: "Cute",
			11: "Letters",
			14: "Logos",
			16: "Utility",
			19: "Flags",
			20: "Hearts",
			12: "Other",
			8: "Animated",
			9: "NSFW",
		};
		const flag = {
			"original style": 1,
			recolors: 18,
			movie: 2,
			gaming: 10,
			meme: 3,
			anime: 4,
			pepe: 13,
			celebrity: 5,
			blobs: 6,
			thinking: 7,
			animals: 17,
			cute: 15,
			letters: 11,
			logos: 14,
			utility: 16,
			flags: 19,
			hearts: 20,
			other: 12,
			animated: 8,
			nsfw: 9,
		};
		// https://emoji.gg/api/
		const query = args.join(" ");
		const res = await axios.get("https://emoji.gg/api/");
		const data = res.data;
		if (args[0] == "category") {
			try {
				const emojis = data.filter(
					(c) => c.category == flag[args.slice(1).join(" ").toLowerCase()]
				);
				if (emojis.length == 0) {
					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						"```Error details: No results found for this category```"
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				} else {
					const embeds = [];
					emojis.forEach((e) => {
						embeds.push(
							BaseImageEmbed(client, message, self)
								.setTitle(e.title)
								.setDescription(`${e.submitted_by}`)
								.addField(
									"Description",
									`${e.description} | [URL](https://emoji.gg/emoji/${e.slug})`
								)
								.addField("Faves", `${e.faves}`)
								.addField("Category", `${flags[e.category]}`)
								.setURL(`https://emoji.gg/emoji/${e.slug}`)
								.setImage(e.image)
						);
					});
					return pagination(message, embeds, ["⬅️", "➡️"], 600000);
				}
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```Error details: An unexpected error has occurred```"
				);
				return message.channel.send(errorEmbed);
			}
		} else {
			try {
				const emojis = data.filter((c) => c.title.includes(query));
				if (emojis.length == 0) {
					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription("```Error details: No results found```");
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				} else {
					const embeds = [];
					emojis.forEach((e) => {
						embeds.push(
							BaseImageEmbed(client, message, self)
								.setTitle(e.title)
								.setDescription(`${e.submitted_by}`)
								.addField(
									"Description",
									`${e.description} | [URL](https://emoji.gg/emoji/${e.slug})`
								)
								.addField("Faves", `${e.faves}`)
								.addField("Category", `${flags[e.category]}`)
								.setURL(`https://emoji.gg/emoji/${e.slug}`)
								.setImage(e.image)
						);
					});
					return pagination(message, embeds, ["⬅️", "➡️"], 600000);
				}
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```Error details: An unexpected error has occurred```"
				);
				return message.channel.send(errorEmbed);
			}
		}
	}
};
