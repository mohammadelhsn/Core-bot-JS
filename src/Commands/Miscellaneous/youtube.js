const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
const youtube = require("ytsr");
const {
	paginate,
	BaseErrorEmbed,
	BaseImageEmbed,
} = require("../../utils/structures/functions");
const { verified } = require("../../../emojis.json");

module.exports = class YoutubeCommand extends BaseCommand {
	constructor() {
		super(
			"youtube",
			"miscellaneous",
			[],
			"<channel || video> <query>",
			"Search YouTube for channels/videos",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[
				"youtube video` - Search videos on YouTube",
				"youtube channel` - Search YouTube channels",
			],
			["youtube video never gonna give you up", "youtube channel PewDiePie"],
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
		const type = args[0];
		const query = args.slice(1).join(" ");

		if (!type) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: Type is a required argument\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (!query) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: Query is a required argument\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const res = await youtube(query).catch((e) => {
			console.log(e);
		});

		if (type.toLowerCase() == "channel" || type.toLowerCase() == "c") {
			const channel = res.items.filter((i) => i.type == "channel")[0];

			if (channel.length == 0) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: Couldn't find any channels that contain ${query}\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			function numberWithCommas(x) {
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}

			const yt = {
				name: channel.name,
				thumbnail: channel.bestAvatar.url,
				verified: `${channel.verified ? verified : "`Not verified`"}`,
				videos: numberWithCommas(channel.videos),
				subs: channel.subscribers,
				description: channel.descriptionShort,
				url: channel.url,
			};

			const embed = BaseImageEmbed(client, message, self)
				.setTitle(yt.name)
				.setDescription(`${yt.description == null ? "" : yt.description}`)
				.setThumbnail(yt.thumbnail)
				.addField("Subscribers", `\`${yt.subs}\``, true)
				.addField("Videos", `\`${yt.videos}\``, true)
				.addField("Verified", yt.verified, true)
				.setURL(yt.url);
			return message.channel.send(embed);
		} else if (type.toLowerCase() == "video" || type.toLowerCase() == "v") {
			const video = res.items.filter((i) => i.type == "video");

			if (video.length == 0 || video.length == "0") {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: Couldn't find anything videos that contain ${query}\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			function numberWithCommas(x) {
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}

			const v = {
				v1: {
					video: {
						title: video[0].title,
						id: video[0].id,
						thumbnail: video[0].bestThumbnail.url,
						duration: video[0].duration,
						views: numberWithCommas(video[0].views),
						description: video[0].description,
						uploaded: `${
							video[0].uploadedAt == null ? "N/A" : video[0].uploadedAt
						}`,
						url: video[0].url,
					},
					channel: {
						name: video[0].author.name,
						url: video[0].author.url,
					},
				},
				v2: {
					video: {
						title: video[1].title,
						id: video[1].id,
						thumbnail: video[1].bestThumbnail.url,
						duration: video[1].duration,
						views: numberWithCommas(video[1].views),
						description: video[1].description,
						uploaded: `${
							video[1].uploadedAt == null ? "N/A" : video[1].uploadedAt
						}`,
						url: video[1].url,
					},
					channel: {
						name: video[1].author.name,
						url: video[1].author.url,
					},
				},
				v3: {
					video: {
						title: video[2].title,
						id: video[2].id,
						thumbnail: video[2].bestThumbnail.url,
						duration: video[2].duration,
						views: numberWithCommas(video[2].views),
						description: video[2].description,
						uploaded: `${
							video[2].uploadedAt == null ? "N/A" : video[2].uploadedAt
						}`,
						url: video[2].url,
					},
					channel: {
						name: video[2].author.name,
						url: video[2].author.url,
					},
				},
				v4: {
					video: {
						title: video[3].title,
						id: video[3].id,
						thumbnail: video[3].bestThumbnail.url,
						duration: video[3].duration,
						views: numberWithCommas(video[3].views),
						description: video[3].description,
						uploaded: `${
							video[3].uploadedAt == null ? "N/A" : video[3].uploadedAt
						}`,
						url: video[3].url,
					},
					channel: {
						name: video[3].author.name,
						url: video[3].author.url,
					},
				},
				v5: {
					video: {
						title: video[4].title,
						id: video[4].id,
						thumbnail: video[4].bestThumbnail.url,
						duration: video[4].duration,
						views: numberWithCommas(video[4].views),
						description: video[4].description,
						uploaded: `${
							video[4].uploadedAt == null ? "N/A" : video[4].uploadedAt
						}`,
						url: video[4].url,
					},
					channel: {
						name: video[4].author.name,
						url: video[4].author.url,
					},
				},
			};

			const embed1 = BaseImageEmbed(client, message, self)
				.setTitle(v.v1.video.title)
				.setDescription(v.v1.video.description)
				.setImage(v.v1.video.thumbnail)
				.addField("Views", `\`${v.v1.video.views}\``)
				.addField("Duration:", `\`${v.v1.video.duration}\``)
				.addField("Uploaded", `\`${v.v1.video.uploaded}\``)
				.addField("Author", `[${v.v1.channel.name}](${v.v1.channel.url})`)
				.setURL(v.v1.video.url);
			const embed2 = BaseImageEmbed(client, message, self)
				.setTitle(v.v2.video.title)
				.setDescription(v.v2.video.description)
				.setImage(v.v2.video.thumbnail)
				.addField("Views", `\`${v.v2.video.views}\``)
				.addField("Duration:", `\`${v.v2.video.duration}\``)
				.addField("Uploaded", `\`${v.v2.video.uploaded}\``)
				.addField("Author", `[${v.v2.channel.name}](${v.v2.channel.url})`)
				.setURL(v.v2.video.url);
			const embed3 = BaseImageEmbed(client, message, self)
				.setTitle(v.v3.video.title)
				.setDescription(v.v3.video.description)
				.setImage(v.v3.video.thumbnail)
				.addField("Views", `\`${v.v3.video.views}\``)
				.addField("Duration:", `\`${v.v3.video.duration}\``)
				.addField("Uploaded", `\`${v.v3.video.uploaded}\``)
				.addField("Author", `[${v.v3.channel.name}](${v.v3.channel.url})`)
				.setURL(v.v3.video.url);
			const embed4 = BaseImageEmbed(client, message, self)
				.setTitle(v.v4.video.title)
				.setDescription(v.v4.video.description)
				.setImage(v.v4.video.thumbnail)
				.addField("Views", `\`${v.v4.video.views}\``)
				.addField("Duration:", `\`${v.v4.video.duration}\``)
				.addField("Uploaded", `\`${v.v4.video.uploaded}\``)
				.addField("Author", `[${v.v4.channel.name}](${v.v4.channel.url})`)
				.setURL(v.v4.video.url);
			const embed5 = BaseImageEmbed(client, message, self)
				.setTitle(v.v5.video.title)
				.setDescription(v.v5.video.description)
				.setImage(v.v5.video.thumbnail)
				.addField("Views", `\`${v.v5.video.views}\``)
				.addField("Duration:", `\`${v.v5.video.duration}\``)
				.addField("Uploaded", `\`${v.v5.video.uploaded}\``)
				.addField("Author", `[${v.v5.channel.name}](${v.v5.channel.url})`)
				.setURL(v.v5.video.url);
			return paginate(message, embed1, embed2, embed3, embed4, embed5);
		} else {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: The type must be <video || channel>\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
	}
};
