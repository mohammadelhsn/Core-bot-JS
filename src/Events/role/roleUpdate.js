const BaseEvent = require("../../Utils/Structures/BaseEvent");
const StateManager = require("../../Utils/StateManager");
const { MessageEmbed, Permissions } = require("discord.js");
const {
	colour,
	capitalize,
	fetchRoleLog,
	getLang,
	getString,
} = require("../../Utils/Structures/Functions");
const flags = {
	CREATE_INSTANT_INVITE: "Create instant invite",
	KICK_MEMBERS: "Kick members",
	BAN_MEMBERS: "Ban members",
	ADMINISTRATOR: "Administrator",
	MANAGE_CHANNELS: "Manage channels",
	MANAGE_GUILD: "Manage guild",
	ADD_REACTIONS: "Add reaction",
	VIEW_AUDIT_LOG: "View audit log",
	PRIORITY_SPEAKER: "Priority speaker",
	STREAM: "Stream",
	VIEW_CHANNEL: "View channel",
	SEND_MESSAGES: "Send messages",
	SEND_TTS_MESSAGES: "Send TTS messages",
	MANAGE_MESSAGES: "Manage messages",
	EMBED_LINKS: "Embed links",
	ATTACH_FILES: "Attach files",
	READ_MESSAGE_HISTORY: "Read message history",
	MENTION_EVERYONE: "Mention everyone",
	USE_EXTERNAL_EMOJIS: "Use external emojis",
	VIEW_GUILD_INSIGHTS: "View guild insights",
	CONNECT: "Connect",
	SPEAK: "Speak",
	MUTE_MEMBERS: "Mute members",
	DEAFEN_MEMBERS: "Deafen members",
	MOVE_MEMBERS: "Move members",
	USE_VAD: "Use voice activity",
	CHANGE_NICKNAME: "Change nickname",
	MANAGE_NICKNAMES: "Manage nicknames",
	MANAGE_ROLES: "Manage roles",
	MANAGE_WEBHOOKS: "Manage webhooks",
	MANAGE_EMOJIS: "Manage emojis",
};

module.exports = class GuildRoleUpdateEvent extends BaseEvent {
	constructor() {
		super("roleUpdate");
		this.connection = StateManager.connection;
	}
	async run(client, oldRole, newRole) {
		const lang = await getLang(newRole.guild.id, this.connection);
		const rolelog = await fetchRoleLog(this.connection, newRole.guild.id);

		if (rolelog == null) {
			return;
		} else {
			if (oldRole.name !== newRole.name) {
				const embed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle(`${capitalize(getString(lang, "new_action"))}`)
					.setDescription(
						`${capitalize(getString(lang, "event"))}: \`Role updated\``
					)
					.addField("Role", `<@&${newRole.id}>`)
					.addField("Change", `\`name\``)
					.addField("Old value:", `\`${oldRole.name}\``)
					.addField("New value:", `\`${newRole.name}\``)
					.setColor(newRole.hexColor)
					.setTimestamp()
					.setThumbnail(newRole.guild.iconURL({ dynamic: true }))
					.setFooter(
						`Role update | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return client.channels.cache.get(rolelog).send(embed);
			} else if (oldRole.hexColor !== newRole.hexColor) {
				const embed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle(`${capitalize(getString(lang, "new_action"))}`)
					.setDescription(
						`${capitalize(getString(lang, "event"))}: \`Role update\``
					)
					.addField("Role:", `<@&${newRole.id}>`)
					.addField("Old value:", `\`${oldRole.hexColor}\``)
					.addField("New value:", `\`${newRole.hexColor}\``)
					.addField("ID", `\`${newRole.id}\``)
					.setColor(newRole.hexColor)
					.setTimestamp()
					.setThumbnail(newRole.guild.iconURL({ dynamic: true }))
					.setFooter(
						`Role update | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return client.channels.cache.get(rolelog).send(embed);
			} else if (oldRole.mentionable !== newRole.mentionable) {
				const embed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle(`${capitalize(getString(lang, "new_action"))}`)
					.setDescription(
						`${capitalize(getString(lang, "event"))}: \`Role update\``
					)
					.addField("Role:", `<@&${newRole.id}>`)
					.addField(
						"Old value:",
						`\`${oldRole.mentionable ? "Mentionable" : "Not mentionable"}\``
					)
					.addField(
						"New value:",
						`\`${newRole.mentionable ? "Mentionable" : "Not mentionable"}\``
					)
					.setColor(newRole.hexColor)
					.setTimestamp()
					.setThumbnail(newRole.guild.iconURL({ dynamic: true }))
					.setFooter(
						`Role update | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return client.channels.cache.get(rolelog).send(embed);
			} else if (oldRole.permissions !== newRole.permissions) {
				const oldRolePermissions = new Permissions(oldRole.permissions);
				const newRolePermissions = new Permissions(newRole.permissions);
				const oRole = oldRolePermissions.toArray();
				const nRole = newRolePermissions.toArray();
				const oRoleflags = `${
					oRole.length ? oRole.map((f) => `\`${flags[f]}\``).join(", ") : ""
				}`;
				const nRoleflags = `${
					nRole.length ? nRole.map((f) => `\`${flags[f]}\``).join(", ") : ""
				}`;

				const embed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle(`${capitalize(getString(lang, "new_action"))}`)
					.setDescription(
						`${capitalize(getString(lang, "event"))}: \`Role update\``
					)
					.addField("Role:", `<@&${newRole.id}>`)
					.addField("Old value:", `${oRoleflags}`)
					.addField("New value:", `${nRoleflags}`)
					.addField("ID", `\`${newRole.id}\``)
					.setColor(newRole.hexColor)
					.setTimestamp()
					.setThumbnail(newRole.guild.iconURL({ dynamic: true }))
					.setFooter(
						`Role update | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return client.channels.cache.get(rolelog).send(embed);
			}
		}
	}
};
