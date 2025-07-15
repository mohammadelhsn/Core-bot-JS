const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageAttachment } = require("discord.js");
const {
	red,
	green,
	purple_dark,
	purple_light,
	purple_medium,
	black,
	blue_dark,
	white,
	red_dark,
	red_light,
	orange,
	pink,
	aqua,
	gold,
	green_dark,
	green_light,
	cream,
	cyan,
} = require("../../../colours.json");
const colours = [
	red,
	green,
	purple_dark,
	purple_light,
	purple_medium,
	black,
	blue_dark,
	white,
	red_dark,
	red_light,
	orange,
	pink,
	aqua,
	gold,
	green_dark,
	green_light,
	cream,
	cyan,
];
const ranNum = Math.floor(Math.random() * colours.length);
const colour = colours[ranNum];
const canvas = require("discord-canvas");

module.exports = class GuildMemberAddEvent extends (
	BaseEvent
) {
	constructor() {
		super("guildMemberAdd");
		this.connection = StateManager.connection;
	}
	async run(client, member) {
		const res = await this.connection.query(
			`SELECT isEnabled FROM welcomesystem WHERE guildId = '${member.guild.id}'`
		);
		const enabled = await res[0][0].isEnabled;

		if (enabled === 1 || enabled === "1") {
			const result = await this.connection.query(
				`SELECT media FROM welcomesystem WHERE guildId = '${member.guild.id}'`
			);
			const media = await result[0][0].media;
			if (media === "image") {
				const response = await this.connection.query(
					`SELECT welcomeMessage FROM welcomesystem WHERE guildId = '${member.guild.id}'`
				);
				const lMessage = await response[0][0].welcomeMessage;

				const info = {
					user: {
						discriminator: member.user.discriminator,
						username: member.user.username,
						id: member.user.id,
						avatar: member.user.displayAvatarURL({ format: "jpg" }),
					},
					message: {
						string: lMessage
							.replace("{user}", member.user.username)
							.replace("{server}", member.guild.name),
					},
					guild: {
						membercount: member.guild.memberCount,
						name: member.guild.name,
					},
				};

				let welcomeCanvas = new canvas.Welcome();

				let image = await welcomeCanvas
					.setUsername(info.user.username)
					.setDiscriminator(info.user.discriminator)
					.setText("message", info.message.string)
					.setText("member-count", "- {count} member(s)!")
					.setMemberCount(info.guild.membercount)
					.setGuildName(info.guild.name)
					.setAvatar(info.user.avatar)
					.setBackground("https://i.imgur.com/PKIbMhC.jpg")
					.setColor("title", cyan)
					.setColor("username", cyan)
					.setColor("hashtag", orange)
					.setColor("discriminator", cyan)
					.setColor("message", cyan)
					.setColor("member-count", orange)
					.toAttachment();

				let attachment = new MessageAttachment(
					image.toBuffer(),
					"goodbye-image.png"
				);

				const reply = await this.connection.query(
					`SELECT welcomeChannelId FROM welcomesystem WHERE guildId = '${member.guild.id}'`
				);
				const channel = await reply[0][0].welcomeChannelId;
				const c = client.channels.cache.get(channel);
				if (c.guild.id !== member.guild.id) {
					return;
				} else {
					try {
						return client.channels.cache.get(channel).send(attachment);
					} catch (e) {
						console.log(e);
					}
				}
			} else if (media === "text") {
				const res = await this.connection.query(
					`SELECT welcomeMessage FROM welcomesystem WHERE guildId = '${member.guild.id}'`
				);
				const lmessage = await res[0][0].welcomeMessage;

				const info = {
					message: {
						string: lmessage
							.replace("{user}", `<@${member.user.id}>`)
							.replace("{server}", member.guild.name),
					},
					user: {
						discrim: member.user.discriminator,
						username: member.user.username,
						id: member.user.id,
						avatar: member.user.displayAvatarURL({ format: "jpg" }),
					},
				};

				const result = await this.connection.query(
					`SELECT welcomeChannelId FROM welcomesystem WHERE guildId = '${member.guild.id}'`
				);

				const channel = await result[0][0].welcomeChannelId;
				const c = client.channels.cache.get(channel);

				if (c.guild.id !== member.guild.id) {
					return;
				} else {
					c.send(info.message.string);
				}
			}
		} else {
			return;
		}
	}
};
