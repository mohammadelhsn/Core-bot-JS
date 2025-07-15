const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseImageEmbed,
} = require("../../utils/structures/functions");
const fetch = require("node-fetch");
const axios = require("axios");
const { MessageAttachment } = require("discord.js");
const { verified } = require("../../../emojis.json");

module.exports = class InstagramCommand extends BaseCommand {
	constructor() {
		super(
			"instagram",
			"miscellaneous",
			[],
			"<username>",
			"Search Instagram for users and get their information",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["instagram ProcessVersion"],
			true,
			3000,
			false,
			false,
			[],
			""
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;

		const user = args[0];
		if (!user) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: You are missing the required argument\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const url = `https://www.instagram.com/${user}/?__a=1`;
		try {
			const res = await axios.get(url);
			const data = res.data;

			const count = Object.keys(data).length;

			if (count === 0 || count === "0") {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: No results found\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			const info = {
				user: {
					thumbnail: data.graphql.user.profile_pic_url_hd,
					name: `\`${data.graphql.user.full_name}\``,
					biography: `\`${data.graphql.user.biography}\``,
					username: `${data.graphql.user.username}`,
					id: `${data.graphql.user.id}`,
				},
				account: {
					followers: `\`${data.graphql.user.edge_followed_by.count}\``,
					following: `\`${data.graphql.user.edge_follow.count}\``,
					posts: `\`${data.graphql.user.edge_owner_to_timeline_media.count}\``,
					private: `\`${data.graphql.user.is_private ? "Private" : "Public"}\``,
					aVerified: `${
						data.graphql.user.is_verified ? `${verified}` : "`Non-verified`"
					}`,
				},
			};

			const profileURL = `https://www.instagram.com/${info.user.username}/`;

			const embed = BaseImageEmbed(client, message, self)
				.setTitle(`${info.user.username} info`)
				.setDescription(
					`${
						data.graphql.user.biography.length > 0
							? `Bio: ${info.user.biography}`
							: ""
					}`
				)
				.addField("Full name", `${info.user.name}`)
				.addField("Followers", `${info.account.followers}`)
				.addField("Following", `${info.account.following}`)
				.addField("Posts", `${info.account.posts}`)
				.addField("Verified", `${info.account.aVerified}`)
				.addField("Private", `${info.account.private}`)
				.setThumbnail(info.user.thumbnail)
				.setURL(profileURL)
				.setFooter(
					`Account ID: ${info.user.id} | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);
			return message.channel.send(embed);
		} catch (e) {
			if (e.response.status == 404) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: I couldn't find this user\`\`\``
				);
				return message.channel.send(errorEmbed);
			}
			console.log(e);
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: An unexpected error has occurred\`\`\``
			);
			return message.channel.send(errorEmbed);
		}
	}
};
