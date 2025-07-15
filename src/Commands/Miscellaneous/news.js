const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseImageEmbed,
	BaseEmbed,
	paginate,
} = require("../../utils/structures/functions");
const newsapi = require("newsapi");
const news = new newsapi("1a2a31c6d93842d19093228f11786c8a");

module.exports = class NewsCommand extends BaseCommand {
	constructor() {
		super(
			"news",
			"miscellaneous",
			[],
			"<query || top || sources || help> (query)",
			"Sends you the news with query",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[
				"news top` - Search the top news",
				"news sources` - Look at the sources",
				"news help` - Sends the help embed",
			],
			["news tech", "news help", "news sources", "news top tech"],
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
		if (args[0]) {
			if (args[0].toLowerCase() === "top") {
				const query = args.slice(1).join(" ");

				if (!query) {
					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						"```Error details: You are missing a required argument```"
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}

				const res = await news.v2.topHeadlines({
					q: query,
					lang: "en",
				});

				if (res.articles.length >= 5 || res.articles.length >= "5") {
					const embed = BaseImageEmbed(client, message, self)
						.setTitle(res.articles[0].title)
						.setDescription(
							`Source: \`${res.articles[0].source.name}\` | Author: \`${
								res.articles[0].author ? res.articles[0].author : "N/A"
							}\``
						)
						.addField("Description", `\`${res.articles[0].description}\``)
						.addField(
							"Content",
							`\`${res.articles[0].content ? res.articles[0].content : "N/A"}\``
						)
						.addField("Published at:", `\`${res.articles[0].publishedAt}\``)
						.setURL(`${res.articles[0].url}`)
						.setImage(
							`${
								res.articles[0].urlToImage == null
									? ""
									: res.articles[0].urlToImage
							}`
						);

					const embed2 = BaseImageEmbed(client, message, self)
						.setTitle(res.articles[1].title)
						.setDescription(
							`Source: \`${res.articles[1].source.name}\` | Author: \`${
								res.articles[1].author ? res.articles[1].author : "N/A"
							}\``
						)
						.addField("Description", `\`${res.articles[1].description}\``)
						.addField(
							"Content",
							`\`${res.articles[1].content ? res.articles[1].content : "N/A"}\``
						)
						.addField("Published at:", `\`${res.articles[1].publishedAt}\``)
						.setURL(`${res.articles[1].url}`)
						.setImage(
							`${
								res.articles[1].urlToImage == null
									? ""
									: res.articles[1].urlToImage
							}`
						);

					const embed3 = BaseImageEmbed(client, message, self)
						.setTitle(res.articles[2].title)
						.setDescription(
							`Source: \`${res.articles[2].source.name}\` | Author: \`${
								res.articles[2].author ? res.articles[2].author : "N/A"
							}\``
						)
						.addField("Description", `\`${res.articles[2].description}\``)
						.addField(
							"Content",
							`\`${res.articles[2].content ? res.articles[2].content : "N/A"}\``
						)
						.addField("Published at:", `\`${res.articles[2].publishedAt}\``)
						.setURL(`${res.articles[2].url}`)
						.setImage(
							`${
								res.articles[2].urlToImage == null
									? ""
									: res.articles[2].urlToImage
							}`
						);

					const embed4 = BaseImageEmbed(client, message, self)
						.setTitle(res.articles[3].title)
						.setDescription(
							`Source: \`${res.articles[3].source.name}\` | Author: \`${
								res.articles[3].author ? res.articles[3].author : "N/A"
							}\``
						)
						.addField("Description", `\`${res.articles[3].description}\``)
						.addField(
							"Content",
							`\`${res.articles[3].content ? res.articles[3].content : "N/A"}\``
						)
						.addField("Published at:", `\`${res.articles[3].publishedAt}\``)
						.setURL(`${res.articles[3].url}`)
						.setImage(
							`${
								res.articles[3].urlToImage == null
									? ""
									: res.articles[3].urlToImage
							}`
						);

					const embed5 = BaseImageEmbed(client, message, self)
						.setTitle(res.articles[4].title)
						.setDescription(
							`Source: \`${res.articles[4].source.name}\` | Author: \`${
								res.articles[4].author ? res.articles[4].author : "N/A"
							}\``
						)
						.addField("Description", `\`${res.articles[4].description}\``)
						.addField(
							"Content",
							`\`${res.articles[4].content ? res.articles[4].content : "N/A"}\``
						)
						.addField("Published at:", `\`${res.articles[4].publishedAt}\``)
						.setURL(`${res.articles[4].url}`)
						.setImage(
							`${
								res.articles[4].urlToImage == null
									? ""
									: res.articles[4].urlToImage
							}`
						);

					return paginate(message, embed, embed2, embed3, embed4, embed5);
				} else if (res.articles.length >= 1 || res.articles.length >= "1") {
					if (res.articles.length == 1) {
						const embed = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[0].title)
							.setDescription(
								`Source: \`${res.articles[0].source.name}\` | Author: \`${
									res.articles[0].author ? res.articles[0].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[0].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[0].content ? res.articles[0].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[0].publishedAt}\``)
							.setURL(`${res.articles[0].url}`)
							.setImage(
								`${
									res.articles[0].urlToImage == null
										? ""
										: res.articles[0].urlToImage
								}`
							);
						return message.channel.send(embed);
					} else if (res.articles.length == 2) {
						const embed = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[0].title)
							.setDescription(
								`Source: \`${res.articles[0].source.name}\` | Author: \`${
									res.articles[0].author ? res.articles[0].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[0].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[0].content ? res.articles[0].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[0].publishedAt}\``)
							.setURL(`${res.articles[0].url}`)
							.setImage(
								`${
									res.articles[0].urlToImage == null
										? ""
										: res.articles[0].urlToImage
								}`
							);

						const embed2 = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[1].title)
							.setDescription(
								`Source: \`${res.articles[1].source.name}\` | Author: \`${
									res.articles[0].author ? res.articles[1].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[0].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[1].content ? res.articles[1].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[1].publishedAt}\``)
							.setURL(`${res.articles[1].url}`)
							.setImage(
								`${
									res.articles[1].urlToImage == null
										? ""
										: res.articles[1].urlToImage
								}`
							);

						return paginate(message, embed, embed2);
					} else if (res.articles.length == 3) {
						const embed = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[0].title)
							.setDescription(
								`Source: \`${res.articles[0].source.name}\` | Author: \`${
									res.articles[0].author ? res.articles[0].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[0].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[0].content ? res.articles[0].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[0].publishedAt}\``)
							.setURL(`${res.articles[0].url}`)
							.setImage(
								`${
									res.articles[0].urlToImage == null
										? ""
										: res.articles[0].urlToImage
								}`
							);
						const embed2 = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[1].title)
							.setDescription(
								`Source: \`${res.articles[1].source.name}\` | Author: \`${
									res.articles[1].author ? res.articles[1].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[1].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[1].content ? res.articles[1].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[1].publishedAt}\``)
							.setURL(`${res.articles[1].url}`)
							.setImage(
								`${
									res.articles[1].urlToImage == null
										? ""
										: res.articles[1].urlToImage
								}`
							);

						const embed3 = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[2].title)
							.setDescription(
								`Source: \`${res.articles[2].source.name}\` | Author: \`${
									res.articles[2].author ? res.articles[2].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[2].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[2].content ? res.articles[2].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[2].publishedAt}\``)
							.setURL(`${res.articles[2].url}`)
							.setImage(
								`${
									res.articles[2].urlToImage == null
										? ""
										: res.articles[2].urlToImage
								}`
							);

						return paginate(message, embed, embed2, embed3);
					} else if (res.articles.length == 4) {
						const embed = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[0].title)
							.setDescription(
								`Source: \`${res.articles[0].source.name}\` | Author: \`${
									res.articles[0].author ? res.articles[0].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[0].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[0].content ? res.articles[0].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[0].publishedAt}\``)
							.setURL(`${res.articles[0].url}`)
							.setImage(
								`${
									res.articles[0].urlToImage == null
										? ""
										: res.articles[0].urlToImage
								}`
							);
						const embed2 = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[1].title)
							.setDescription(
								`Source: \`${res.articles[1].source.name}\` | Author: \`${
									res.articles[1].author ? res.articles[1].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[1].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[1].content ? res.articles[1].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[1].publishedAt}\``)
							.setURL(`${res.articles[1].url}`)
							.setImage(
								`${
									res.articles[1].urlToImage == null
										? ""
										: res.articles[1].urlToImage
								}`
							);

						const embed3 = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[2].title)
							.setDescription(
								`Source: \`${res.articles[2].source.name}\` | Author: \`${
									res.articles[2].author ? res.articles[2].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[2].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[2].content ? res.articles[2].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[2].publishedAt}\``)
							.setURL(`${res.articles[2].url}`)
							.setImage(
								`${
									res.articles[2].urlToImage == null
										? ""
										: res.articles[2].urlToImage
								}`
							);

						const embed4 = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[3].title)
							.setDescription(
								`Source: \`${res.articles[3].source.name}\` | Author: \`${
									res.articles[3].author ? res.articles[3].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[3].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[3].content ? res.articles[3].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[3].publishedAt}\``)
							.setURL(`${res.articles[3].url}`)
							.setImage(
								`${
									res.articles[3].urlToImage == null
										? ""
										: res.articles[3].urlToImage
								}`
							);
						return paginate(message, embed, embed2, embed3, embed4);
					}
				} else {
					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						`\`\`\`Error details: Cannot find anything for ${query}\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}
			} else if (args[0].toLowerCase() === "sources") {
				const query = args.slice(1).join(" ");

				const res = await news.v2.sources({
					category: query,
					lang: "en",
				});
				if (res.sources.length >= 5 || res.sources.length >= "5") {
					const embed = BaseEmbed(client, message, self)
						.setTitle(res.sources[0].name)
						.setDescription(`\`${res.sources[0].description}\``)
						.setURL(res.sources[0].url)
						.addField("Category:", `\`${res.sources[0].category}\``)
						.addField("Language", `\`${res.sources[0].language}\``)
						.addField("Country", `\`${res.sources[0].country}\``);

					const embed2 = BaseEmbed(client, message, self)
						.setTitle(res.sources[1].name)
						.setDescription(`\`${res.sources[1].description}\``)
						.setURL(res.sources[1].url)
						.addField("Category:", `\`${res.sources[1].category}\``)
						.addField("Language", `\`${res.sources[1].language}\``)
						.addField("Country", `\`${res.sources[1].country}\``);
					const embed3 = BaseEmbed(client, message, self)
						.setTitle(res.sources[2].name)
						.setDescription(`\`${res.sources[2].description}\``)
						.setURL(res.sources[2].url)
						.addField("Category:", `\`${res.sources[2].category}\``)
						.addField("Language", `\`${res.sources[2].language}\``)
						.addField("Country", `\`${res.sources[2].country}\``);
					const embed4 = BaseEmbed(client, message, self)
						.setTitle(res.sources[3].name)
						.setDescription(`\`${res.sources[3].description}\``)
						.setURL(res.sources[3].url)
						.addField("Category:", `\`${res.sources[3].category}\``)
						.addField("Language", `\`${res.sources[3].language}\``)
						.addField("Country", `\`${res.sources[3].country}\``);
					const embed5 = BaseEmbed(client, message, self)
						.setTitle(res.sources[4].name)
						.setDescription(`\`${res.sources[4].description}\``)
						.setURL(res.sources[4].url)
						.addField("Category:", `\`${res.sources[4].category}\``)
						.addField("Language", `\`${res.sources[4].language}\``)
						.addField("Country", `\`${res.sources[4].country}\``);

					return paginate(message, embed, embed2, embed3, embed4, embed5);
				} else if (res.sources.length >= 1 || res.sources.length >= "1") {
					if (res.sources.length == 1) {
						const embed = BaseEmbed(client, message, self)
							.setTitle(res.sources[0].name)
							.setDescription(`\`${res.sources[0].description}\``)
							.setURL(res.sources[0].url)
							.addField("Category:", `\`${res.sources[0].category}\``)
							.addField("Language", `\`${res.sources[0].language}\``)
							.addField("Country", `\`${res.sources[0].country}\``);
						return message.channel.send(embed);
					} else if (res.sources.length == 2) {
						const embed = BaseEmbed(client, message, self)
							.setTitle(res.sources[0].name)
							.setDescription(`\`${res.sources[0].description}\``)
							.setURL(res.sources[0].url)
							.addField("Category:", `\`${res.sources[0].category}\``)
							.addField("Language", `\`${res.sources[0].language}\``)
							.addField("Country", `\`${res.sources[0].country}\``);
						const embed2 = BaseEmbed(client, message, self)
							.setTitle(res.sources[1].name)
							.setDescription(`\`${res.sources[1].description}\``)
							.setURL(res.sources[1].url)
							.addField("Category:", `\`${res.sources[1].category}\``)
							.addField("Language", `\`${res.sources[1].language}\``)
							.addField("Country", `\`${res.sources[1].country}\``);

						return paginate(message, embed, embed2);
					} else if (res.sources.length == 3) {
						const embed = BaseEmbed(client, message, self)
							.setTitle(res.sources[0].name)
							.setDescription(`\`${res.sources[0].description}\``)
							.setURL(res.sources[0].url)
							.addField("Category:", `\`${res.sources[0].category}\``)
							.addField("Language", `\`${res.sources[0].language}\``)
							.addField("Country", `\`${res.sources[0].country}\``);

						const embed2 = BaseEmbed(client, message, self)
							.setTitle(res.sources[1].name)
							.setDescription(`\`${res.sources[1].description}\``)
							.setURL(res.sources[1].url)
							.addField("Category:", `\`${res.sources[1].category}\``)
							.addField("Language", `\`${res.sources[1].language}\``)
							.addField("Country", `\`${res.sources[1].country}\``);
						const embed3 = BaseEmbed(client, message, self)
							.setTitle(res.sources[2].name)
							.setDescription(`\`${res.sources[2].description}\``)
							.setURL(res.sources[2].url)
							.addField("Category:", `\`${res.sources[2].category}\``)
							.addField("Language", `\`${res.sources[2].language}\``)
							.addField("Country", `\`${res.sources[2].country}\``);
						return paginate(message, embed, embed2, embed3);
					} else if (res.sources.length == 4) {
						const embed = BaseEmbed(client, message, self)
							.setTitle(res.sources[0].name)
							.setDescription(`\`${res.sources[0].description}\``)
							.setURL(res.sources[0].url)
							.addField("Category:", `\`${res.sources[0].category}\``)
							.addField("Language", `\`${res.sources[0].language}\``)
							.addField("Country", `\`${res.sources[0].country}\``);

						const embed2 = BaseEmbed(client, message, self)
							.setTitle(res.sources[1].name)
							.setDescription(`\`${res.sources[1].description}\``)
							.setURL(res.sources[1].url)
							.addField("Category:", `\`${res.sources[1].category}\``)
							.addField("Language", `\`${res.sources[1].language}\``)
							.addField("Country", `\`${res.sources[1].country}\``);
						const embed3 = BaseEmbed(client, message, self)
							.setTitle(res.sources[2].name)
							.setDescription(`\`${res.sources[2].description}\``)
							.setURL(res.sources[2].url)
							.addField("Category:", `\`${res.sources[2].category}\``)
							.addField("Language", `\`${res.sources[2].language}\``)
							.addField("Country", `\`${res.sources[2].country}\``);
						const embed4 = BaseEmbed(client, message, self)
							.setTitle(res.sources[3].name)
							.setDescription(`\`${res.sources[3].description}\``)
							.setURL(res.sources[3].url)
							.addField("Category:", `\`${res.sources[3].category}\``)
							.addField("Language", `\`${res.sources[3].language}\``)
							.addField("Country", `\`${res.sources[3].country}\``);
						return paginate(message, embed, embed2, embed3, embed4);
					}
				} else {
					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						`\`\`\`Error details: No results found\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}
			} else if (args[0].toLowerCase() == "help") {
				return await BaseHelpEmbed(client, message, self);
			} else {
				const query = args.join(" ");
				const res = await news.v2.everything({
					q: query,
					lang: "en",
				});
				if (res.articles.length >= 5 || res.articles.length >= "5") {
					const embed = BaseImageEmbed(client, message, self)
						.setTitle(res.articles[0].title)
						.setDescription(
							`Source: \`${res.articles[0].source.name}\` | Author: \`${
								res.articles[0].author ? res.articles[0].author : "N/A"
							}\``
						)
						.addField("Description", `\`${res.articles[0].description}\``)
						.addField(
							"Content",
							`\`${res.articles[0].content ? res.articles[0].content : "N/A"}\``
						)
						.addField("Published at:", `\`${res.articles[0].publishedAt}\``)
						.setURL(`${res.articles[0].url}`)
						.setImage(
							`${
								res.articles[0].urlToImage == null
									? ""
									: res.articles[0].urlToImage
							}`
						);

					const embed2 = BaseImageEmbed(client, message, self)
						.setTitle(res.articles[1].title)
						.setDescription(
							`Source: \`${res.articles[1].source.name}\` | Author: \`${
								res.articles[1].author ? res.articles[1].author : "N/A"
							}\``
						)
						.addField("Description", `\`${res.articles[1].description}\``)
						.addField(
							"Content",
							`\`${res.articles[1].content ? res.articles[1].content : "N/A"}\``
						)
						.addField("Published at:", `\`${res.articles[1].publishedAt}\``)
						.setURL(`${res.articles[1].url}`)
						.setImage(
							`${
								res.articles[1].urlToImage == null
									? ""
									: res.articles[1].urlToImage
							}`
						);

					const embed3 = BaseImageEmbed(client, message, self)
						.setTitle(res.articles[2].title)
						.setDescription(
							`Source: \`${res.articles[2].source.name}\` | Author: \`${
								res.articles[2].author ? res.articles[2].author : "N/A"
							}\``
						)
						.addField("Description", `\`${res.articles[2].description}\``)
						.addField(
							"Content",
							`\`${res.articles[2].content ? res.articles[2].content : "N/A"}\``
						)
						.addField("Published at:", `\`${res.articles[2].publishedAt}\``)
						.setURL(`${res.articles[2].url}`)
						.setImage(
							`${
								res.articles[2].urlToImage == null
									? ""
									: res.articles[2].urlToImage
							}`
						);

					const embed4 = BaseImageEmbed(client, message, self)
						.setTitle(res.articles[3].title)
						.setDescription(
							`Source: \`${res.articles[3].source.name}\` | Author: \`${
								res.articles[3].author ? res.articles[3].author : "N/A"
							}\``
						)
						.addField("Description", `\`${res.articles[3].description}\``)
						.addField(
							"Content",
							`\`${res.articles[3].content ? res.articles[3].content : "N/A"}\``
						)
						.addField("Published at:", `\`${res.articles[3].publishedAt}\``)
						.setURL(`${res.articles[3].url}`)
						.setImage(
							`${
								res.articles[3].urlToImage == null
									? ""
									: res.articles[3].urlToImage
							}`
						);

					const embed5 = BaseImageEmbed(client, message, self)
						.setTitle(res.articles[4].title)
						.setDescription(
							`Source: \`${res.articles[4].source.name}\` | Author: \`${
								res.articles[4].author ? res.articles[4].author : "N/A"
							}\``
						)
						.addField("Description", `\`${res.articles[4].description}\``)
						.addField(
							"Content",
							`\`${res.articles[4].content ? res.articles[4].content : "N/A"}\``
						)
						.addField("Published at:", `\`${res.articles[4].publishedAt}\``)
						.setURL(`${res.articles[4].url}`)
						.setImage(
							`${
								res.articles[4].urlToImage == null
									? ""
									: res.articles[4].urlToImage
							}`
						);

					return paginate(message, embed, embed2, embed3, embed4, embed5);
				} else if (res.articles.length >= 1 || res.articles.length >= "1") {
					if (res.articles.length == 1) {
						const embed = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[0].title)
							.setDescription(
								`Source: \`${res.articles[0].source.name}\` | Author: \`${
									res.articles[0].author ? res.articles[0].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[0].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[0].content ? res.articles[0].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[0].publishedAt}\``)
							.setURL(`${res.articles[0].url}`)
							.setImage(
								`${
									res.articles[0].urlToImage == null
										? ""
										: res.articles[0].urlToImage
								}`
							);
						return message.channel.send(embed);
					} else if (res.articles.length == 2) {
						const embed = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[0].title)
							.setDescription(
								`Source: \`${res.articles[0].source.name}\` | Author: \`${
									res.articles[0].author ? res.articles[0].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[0].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[0].content ? res.articles[0].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[0].publishedAt}\``)
							.setURL(`${res.articles[0].url}`)
							.setImage(
								`${
									res.articles[0].urlToImage == null
										? ""
										: res.articles[0].urlToImage
								}`
							);

						const embed2 = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[1].title)
							.setDescription(
								`Source: \`${res.articles[1].source.name}\` | Author: \`${
									res.articles[0].author ? res.articles[1].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[0].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[1].content ? res.articles[1].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[1].publishedAt}\``)
							.setURL(`${res.articles[1].url}`)
							.setImage(
								`${
									res.articles[1].urlToImage == null
										? ""
										: res.articles[1].urlToImage
								}`
							);

						return paginate(message, embed, embed2);
					} else if (res.articles.length == 3) {
						const embed = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[0].title)
							.setDescription(
								`Source: \`${res.articles[0].source.name}\` | Author: \`${
									res.articles[0].author ? res.articles[0].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[0].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[0].content ? res.articles[0].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[0].publishedAt}\``)
							.setURL(`${res.articles[0].url}`)
							.setImage(
								`${
									res.articles[0].urlToImage == null
										? ""
										: res.articles[0].urlToImage
								}`
							);
						const embed2 = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[1].title)
							.setDescription(
								`Source: \`${res.articles[1].source.name}\` | Author: \`${
									res.articles[1].author ? res.articles[1].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[1].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[1].content ? res.articles[1].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[1].publishedAt}\``)
							.setURL(`${res.articles[1].url}`)
							.setImage(
								`${
									res.articles[1].urlToImage == null
										? ""
										: res.articles[1].urlToImage
								}`
							);

						const embed3 = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[2].title)
							.setDescription(
								`Source: \`${res.articles[2].source.name}\` | Author: \`${
									res.articles[2].author ? res.articles[2].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[2].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[2].content ? res.articles[2].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[2].publishedAt}\``)
							.setURL(`${res.articles[2].url}`)
							.setImage(
								`${
									res.articles[2].urlToImage == null
										? ""
										: res.articles[2].urlToImage
								}`
							);

						return paginate(message, embed, embed2, embed3);
					} else if (res.articles.length == 4) {
						const embed = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[0].title)
							.setDescription(
								`Source: \`${res.articles[0].source.name}\` | Author: \`${
									res.articles[0].author ? res.articles[0].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[0].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[0].content ? res.articles[0].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[0].publishedAt}\``)
							.setURL(`${res.articles[0].url}`)
							.setImage(
								`${
									res.articles[0].urlToImage == null
										? ""
										: res.articles[0].urlToImage
								}`
							);
						const embed2 = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[1].title)
							.setDescription(
								`Source: \`${res.articles[1].source.name}\` | Author: \`${
									res.articles[1].author ? res.articles[1].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[1].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[1].content ? res.articles[1].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[1].publishedAt}\``)
							.setURL(`${res.articles[1].url}`)
							.setImage(
								`${
									res.articles[1].urlToImage == null
										? ""
										: res.articles[1].urlToImage
								}`
							);

						const embed3 = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[2].title)
							.setDescription(
								`Source: \`${res.articles[2].source.name}\` | Author: \`${
									res.articles[2].author ? res.articles[2].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[2].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[2].content ? res.articles[2].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[2].publishedAt}\``)
							.setURL(`${res.articles[2].url}`)
							.setImage(
								`${
									res.articles[2].urlToImage == null
										? ""
										: res.articles[2].urlToImage
								}`
							);

						const embed4 = BaseImageEmbed(client, message, self)
							.setTitle(res.articles[3].title)
							.setDescription(
								`Source: \`${res.articles[3].source.name}\` | Author: \`${
									res.articles[3].author ? res.articles[3].author : "N/A"
								}\``
							)
							.addField("Description", `\`${res.articles[3].description}\``)
							.addField(
								"Content",
								`\`${
									res.articles[3].content ? res.articles[3].content : "N/A"
								}\``
							)
							.addField("Published at:", `\`${res.articles[3].publishedAt}\``)
							.setURL(`${res.articles[3].url}`)
							.setImage(
								`${
									res.articles[3].urlToImage == null
										? ""
										: res.articles[3].urlToImage
								}`
							);
						return paginate(message, embed, embed2, embed3, embed4);
					}
				} else {
					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						`\`\`\`Error details: Cannot find anything for ${query}\`\`\``
					);
					return message.channel.send(errorEmbed);
				}
			}
		} else {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: The first argument must be have something. <top | sources or your query to search over all periods of time>```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
	}
};
