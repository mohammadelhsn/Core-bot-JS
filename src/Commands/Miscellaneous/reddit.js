const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseImageEmbed,
	BaseHelpEmbed,
	BaseEmbed,
	formatNumber,
	capitalize,
} = require("../../utils/structures/functions");
const request = require("node-superfetch");
const fetch = require("node-fetch");
const dateformat = require("dateformat");

module.exports = class RedditSearchCommand extends BaseCommand {
	constructor() {
		super(
			"reddit",
			"miscellaenous",
			[],
			"<user || subreddit> <search>",
			"Search subreddits or users",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[
				"reddit help` - Send help embed",
				"reddit user` - Search reddit users",
				"reddit subreddit` - Search subreddits",
			],
			[
				"reddit user techmxster",
				"reddit subreddit prequelmemes",
				"reddit help",
			],
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
		// link: https://www.reddit.com/user/${user}/about.json

		const type = args[0];
		const query = args.slice(1).join(" ");

		if (!query) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: You are missing a required argument```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		} else {
			if (!type) {
				return await BaseHelpEmbed(client, message, self);
			} else if (type.toLowerCase() === "user") {
				try {
					const { body } = await request.get(
						`https://www.reddit.com/user/${query}/about.json`
					);

					const { data } = body;
					//console.log(dateformat(data.created_utc * 1000));

					if (data.hide_from_robots) {
						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription(
							"```Error details: This user is hidden from bots```"
						);
						const msg = await message.channel.send(errorEmbed);
						return msg.delete({ timeout: 10000 });
					}
					const embed = BaseImageEmbed(client, message, self)
						.setTitle(data.subreddit.display_name_prefixed)
						.setURL(`https://www.reddit.com/${data.url}`)
						.setThumbnail(data.icon_img.replace(/(amp;)/gi, ""))
						.addField(
							"Total karma",
							`\`${formatNumber(Number(data.total_karma))}\``
						)
						.addField(
							"Creation date",
							`\`${dateformat(data.created_utc * 1000)}\``
						)
						.addField("Employee?", `\`${data.is_employee ? "Yes" : "No"}\``)
						.addField("Premium", `\`${data.is_gold ? "Yes" : "No"}\``);
					return message.channel.send(embed);
				} catch (err) {
					if (err.status == 404) {
						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription("```Error details: User not found```");
						const msg = await message.channel.send(errorEmbed);
						return msg.delete({ timeout: 10000 });
					} else {
						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription(
							"```Error details: An unexpected error has occurred```"
						);
						return message.channel.send(errorEmbed);
					}
				}
			} else if (type.toLowerCase() === "subreddit") {
				try {
					const { body } = await request.get(
						`https://www.reddit.com/r/${query}/about.json`
					);
					const { data } = body;

					const embed = BaseImageEmbed(client, message, self)
						.setTitle(data.display_name_prefixed)
						.setURL(`https://reddit.com/${data.url}`)
						.setThumbnail(data.community_icon.replace(/(amp;)/gi, ""))
						.setImage(
							data.banner_background_image
								? data.banner_background_image.replace(/(amp;)/gi, "")
								: ""
						)
						.setDescription(`Description: \`${data.public_description}\``)
						.addField(
							"Subreddit type",
							`\`${capitalize(data.subreddit_type)}\``
						)
						.addField("Language", `\`${capitalize(data.lang)}\``)
						.addField(
							"Subscribers",
							`\`${formatNumber(Number(data.subscribers))}\``
						)
						.addField(
							"Accounts active:",
							`\`${formatNumber(Number(data.accounts_active))}\``
						)
						.addField("Quarantined?", `\`${data.quarantine ? "Yes" : "No"}\``)
						.addField("NSFW?", `\`${data.over18 ? "Yes" : "No"}\``)
						.addField("Created:", `\`${dateformat(data.created_utc * 1000)}\``);
					return message.channel.send(embed);
				} catch (err) {
					if (err.status == 404) {
						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription(
							"```Error details: Cannot find this subreddit```"
						);
						const msg = await message.channel.send(errorEmbed);
						return msg.delete({ timeout: 10000 });
					} else {
						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription(
							"```Error details: An unexpected error has occurred!```"
						);
						return message.channel.send(errorEmbed);
					}
				}
				/*
				icon_img,
				display_name_prefixed,
				accounts_active,
				subscribers,
				quarantine,
				public description,
				banner background,
				created_utc,
				subreddit type,
				over18,
				lang
				*/
			} else {
			}
		}
	}
};
