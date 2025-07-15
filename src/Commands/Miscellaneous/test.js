const BaseCommand = require("../../utils/structures/BaseCommand");
const { UserFlags } = require("discord.js");

module.exports = class TesstCommand extends BaseCommand {
	constructor() {
		super(
			"tesst",
			"miscellaneous",
			[],
			"",
			"This is a public testing command.",
			"",
			[],
			[],
			[],
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

		const userflag = {
			DISCORD_EMPLOYEE: this.Emojis.discord_staff,
			DISCORD_PARTNER: this.Emojis.discord_partner,
			BUGHUNTER_LEVEL_1: this.Emojis.bug_hunter,
			BUGHUNTER_LEVEL_2: this.Emojis.bug_hunter_2,
			HYPESQUAD_EVENTS: this.Emojis.hypesquad_events,
			HOUSE_BRAVERY: this.Emojis.hypesquad_bravery,
			HOUSE_BRILLIANCE: this.Emojis.hypesquad_brilliance,
			HOUSE_BALANCE: this.Emojis.hypesquad_balance,
			EARLY_SUPPORTER: this.Emojis.earlysupporter,
			TEAM_USER: "Team User",
			SYSTEM: this.Emojis.system,
			VERIFIED_BOT: this.Emojis.bot_emoji,
			VERIFIED_DEVELOPER: this.Emojis.discord_bot_dev,
		};
		if (!args[0]) {
			const u = message.member;
			let userflags = null;
			if (u.user.flags !== null) {
				const flags = new UserFlags(u.user.flags);
				const flag = flags.toArray();
				userflags = `${
					flag.length ? flag.map((f) => userflag[f]).join(" ") : "N/A"
				}`;
			}

			const embed = await this.Embed.Base({
				client: client,
				iconURL: u.user.displayAvatarURL({ dynamic: true }),
				command: this,
				title: `${u.user.username}#${u.user.discriminator} information`,
				description: `Badges: ${userflags ? userflags : "N/A"}`,
				fields: [
					{
						name: "Name",
						value: `${
							u.nickname
								? `\`${u.nickname}\` AKA \`${u.user.username}\``
								: `\`${u.user.username}\``
						}`,
					},
					{ name: "Discriminator", value: `\`#${u.user.discriminator}\`` },
					{
						name: "ID",
						value: `\`${u.user.id}\``,
					},
					{
						name: "Presence",
						value: `\`${this.Utils.capitalize(u.presence.status)}\``,
					},
					{ name: "Created at", value: `\`${u.user.createdAt}\`` },
					{ name: "Joined at", value: `\`${u.joinedAt}\`` },
					{ name: "Bannable?", value: `\`${u.bannable ? "Yes" : "No"}\`` },
					{ name: "Kickable?", value: `\`${u.kickable ? "Yes" : "No"}\`` },
					{
						name: "Roles",
						value: `${u.roles.cache.map((r) => `${r}`).join(" | ")}`,
					},
				],
			});
			return message.channel.send({ embed: embed });
		}

		const user =
			message.mentions.members.first() ||
			message.guild.members.cache.find((u) => u.user.id == args[0]) ||
			message.guild.members.cache.find((u) => u.user.username == args[0]) ||
			message.guild.members.cache.find((u) => u.nickname == args[0]);

		if (!user) {
			const u = args[0];
			try {
				const profile = await client.users.fetch(u);

				const flags = new UserFlags(profile.flags);
				const flag = flags.toArray();
				const userflags = `${
					flag.length ? flag.map((f) => userflag[f]).join(" ") : "N/A"
				}`;

				const embed = await this.Embed.Base({
					client: client,
					iconURL: profile.displayAvatarURL({ dynamic: true }),
					command: this,
					title: `${profile.username}#${profile.discriminator} information`,
					description: `Badges: ${userflags}`,
					fields: [
						{ name: "Username", value: `\`${profile.username}\`` },
						{ name: "ID", value: `\`${profile.id}\`` },
						{ name: "Discriminator", value: `\`${profile.discriminator}\`` },
						{ name: "Created at", value: `\`${profile.createdAt}\`` },
					],
				});

				return message.channel.send({ embed: embed });
			} catch (e) {
				if (e.httpStatus == 400) {
					const embed = await this.ErrorEmbed.Base({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						command: this,
						error_message: "Provided value is not an ID (snowflake)",
					});
					const msg = await message.channel.send({ embed: embed });
					return msg.delete({ timeout: 10000 });
				}
				if (e.httpStatus == 404) {
					const embed = await this.ErrorEmbed.Base({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						command: this,
						error_message: "Provided user doesn't exist or is banned",
					});
					const msg = await message.channel.send({ embed: embed });
					return msg.delete({ timeout: 10000 });
				}
				console.log(e);

				const embed = await this.ErrorEmbed.UnexpectedError({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: this,
				});
				const msg = await message.channel.send({ embed: embed });
				return msg.delete({ timeout: 10000 });
			}
		} else {
			let userflags = null;
			if (user.user.flags !== null) {
				const flags = new UserFlags(user.user.flags);
				const flag = flags.toArray();
				userflags = `${
					flag.length ? flag.map((f) => userflag[f]).join(" ") : "N/A"
				}`;
			}

			const embed = await this.Embed.Base({
				client: client,
				iconURL: user.user.displayAvatarURL({ dynamic: true }),
				command: this,
				title: `${user.user.username}#${user.user.discriminator} information`,
				description: `Badges: ${userflags ? userflags : "N/A"}`,
				fields: [
					{
						name: "Name",
						value: `${
							user.nickname
								? `\`${user.nickname}\` AKA \`${user.user.username}\``
								: `\`${user.user.username}\``
						}`,
					},
					{ name: "Discriminator", value: `\`#${user.user.discriminator}\`` },
					{
						name: "ID",
						value: `\`${user.user.id}\``,
					},
					{
						name: "Presence",
						value: `\`${this.Utils.capitalize(user.presence.status)}\``,
					},
					{ name: "Created at", value: `\`${user.user.createdAt}\`` },
					{ name: "Joined at", value: `\`${user.joinedAt}\`` },
					{ name: "Bannable?", value: `\`${user.bannable ? "Yes" : "No"}\`` },
					{ name: "Kickable?", value: `\`${user.kickable ? "Yes" : "No"}\`` },
					{
						name: "Roles",
						value: `${user.roles.cache.map((r) => `${r}`).join(" | ")}`,
					},
				],
			});
			return message.channel.send({ embed: embed });
		}
	}
};
