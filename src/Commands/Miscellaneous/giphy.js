require("dotenv").config();
const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../Utils/StateManager");
const pagination = require("discord.js-pagination");
const giphy = require("giphy-api")(process.env.GIPHY);
const {
	BaseErrorEmbed,
	BaseImageEmbed,
} = require("../../utils/structures/functions");

module.exports = class GiphyCommand extends BaseCommand {
	constructor() {
		super(
			"giphy",
			"miscellaneous",
			[],
			"<query || random || sticker> (query)",
			"Search giphy for gifs",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[
				"giphy random` - Sends a random gif",
				"giphy stickers` - Searches through giphy stickers",
			],
			["giphy random", "giphy hello there", "giphy sticker hello!"],
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
		const self = this;
		const type = args[0];
		if (type) {
			if (type == "sticker") {
				try {
					const q = args.slice(1).join(" ");
					const res = await giphy.search({ api: "stickers", q: q });
					if (res.data.length == 0) {
						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription("```Error details: No results found```");
						const msg = await message.channel.send(errorEmbed);
						return msg.delete({ timeout: 10000 });
					}
					const embeds = [];
					res.data.forEach((gif) => {
						embeds.push(
							BaseImageEmbed(client, message, self)
								.setAuthor(
									client.user.username,
									message.author.displayAvatarURL({ dynamic: true })
								)
								.setTitle(gif.title)
								.setDescription(`Provided by: \`Giphy API\``)
								.addField("Uploaded at", `\`${gif.import_datetime}\``)
								.addField("Rating", `\`${gif.rating}\``)
								.addField("Sources", `[${gif.title}](${gif.source})`)
								.setImage(gif.images.original.url)
								.setThumbnail(
									message.author.displayAvatarURL({ dynamic: true })
								)
								.setURL(gif.url)
						);
					});
					return pagination(message, embeds, ["⬅️", "➡️"], 600000);
				} catch (e) {
					console.log(e);

					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						"```Error details: An unexpected error has occurred```"
					);
					return message.channel.send(errorEmbed);
				}
			} else if (type == "random") {
				try {
					const q = args.slice(1).join(" ");
					const res = await giphy.random(q);
					if (res.meta.status !== 200) {
						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription("```Error details: API error```");
						const msg = await message.channel.send(errorEmbed);
						return msg.delete({ timeout: 10000 });
					} else if (res.meta.status == 200) {
						const embed = BaseImageEmbed(client, message, self)
							.setTitle(res.data.title)
							.setDescription("Provided by: `Giphy API`")
							.addField("Uploaded at:", `\`${res.data.import_datetime}\``)
							.addField("Rating", `\`${res.data.rating}\``)
							.addField("Source", `[${res.data.title}](${res.data.source})`)
							.setImage(res.data.images.original.url)
							.setURL(res.data.url);
						return message.channel.send(embed);
					}
				} catch (e) {
					console.log(e);

					const embed = await BaseErrorEmbed(client, message, self);
					embed.setDescription(
						"```Error details: An unexpected error has occurred```"
					);
					return message.channel.send(embed);
				}
			} else {
				try {
					const q = args.join(" ");
					const res = await giphy.search(q);
					if (res.data.length == 0) {
						const eEmbed = await BaseErrorEmbed(client, message, self);
						eEmbed.setDescription("```Error details: No results found```");
						const msg = await message.channel.send(eEmbed);
						return msg.delete({ timeout: 10000 });
					}
					const embeds = [];
					res.data.forEach((gif) => {
						embeds.push(
							BaseImageEmbed(client, message, self)
								.setTitle(gif.title)
								.setDescription(`Provided by: \`Giphy API\``)
								.addField("Uploaded at", `\`${gif.import_datetime}\``)
								.addField("Rating", `\`${gif.rating}\``)
								.addField("Sources", `[${gif.title}](${gif.source})`)
								.setImage(gif.images.original.url)
								.setURL(gif.url)
						);
					});
					return pagination(message, embeds, ["⬅️", "➡️"], 600000);
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
	}
};
