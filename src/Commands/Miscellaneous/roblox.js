const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseEmbed,
	BaseImageEmbed,
} = require("../../utils/structures/functions");
const roblox = require("noblox.js");
const dateFormat = require("dateformat");

module.exports = class RobloxCommand extends BaseCommand {
	constructor() {
		super(
			"roblox",
			"miscellaneous",
			[],
			"<username>",
			"Search for a ROBLOX user",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["roblox 404"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		const self = this;
		const username = args.join(" ");

		if (!username) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: Please mention a user to search!\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		roblox
			.getIdFromUsername(username)
			.then(async (id) => {
				try {
					if (id) {
						try {
							roblox.getPlayerInfo(parseInt(id)).then(async function (info) {
								/* console.log(info);
								const date = new Date(info.joinDate);
								const dateinfo = dateFormat(
									date,
									"dddd, mmmm, dS, yyyy, h:MM:ss TT"
								); */

								if (info.isBanned == true) {
									const embed = BaseImageEmbed(client, message, self)
										.setTitle(info.username)
										.setDescription(":warning: | This user is banned.")
										.addField("Bio", `${info.blurb}`)
										.addField("Join date", `\`${info.joinDate}\``)
										.setThumbnail(
											`https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`
										);
									return message.channel.send(embed);
								}

								const user = {
									username: `${
										info.username.length > 0 ? info.username : "Not available"
									}`,
									id: `${id}`,
									bio: `${info.blurb ? `"${info.blurb}"` : "Nothing"}`,
									status: `\`${info.status ? `"${info.status}"` : "Nothing"}\``,
									age: `\`${
										info.age ? `${info.age} day(s) old` : "Not available"
									}\``,
									/* 									date: `\`${dateinfo ? dateinfo : "N/A"}\``, */
									thumbnail: `https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`,
									usernames: `${
										info.oldNames.length > 0
											? `AKA: ${info.oldNames
													.map((n) => `\`${n}\``)
													.join(", ")}`
											: ""
									}`,
									url: `https://roblox.com/users/${id}/profile`,
								};

								const embed = BaseEmbed(client, message, self)
									.setTitle(user.username)
									.setDescription(user.usernames)
									.setThumbnail(user.thumbnail)
									.addField("Username", `\`${user.username}\``)
									.addField("User id", `\`${user.id}\``)
									.addField("Bio", `${user.bio}`)
									.addField("Status", `${user.status}`)
									.addField("Account age", `${user.age}`)
									.addField("Link", `${user.url}`)
									.setURL(user.url);
								return message.channel.send(embed);
							});
						} catch (e) {
							console.log(e);

							const errorEmbed = await BaseErrorEmbed(client, message, self);
							errorEmbed.setDescription(
								"```Error details: An unexpected error has occurred!```"
							);
							return message.channel.send(errorEmbed);
						}
					}
				} catch (e) {
					console.log(e);

					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						`\`\`\`Error details: This user doesn't exist or is banned!\`\`\``
					);
					return message.channel.send(errorEmbed);
				}
			})
			.catch(async function (err) {
				console.log(err);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: This user doesn't exist or is banned!\`\`\``
				);
				return message.channel.send(errorEmbed);
			});
	}
};
