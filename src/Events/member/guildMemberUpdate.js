const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const {
	colour,
	fetchActionLog,
	getLang,
	getString,
	capitalize,
} = require("../../utils/structures/functions");

function getRoleDiff(m1, m2) {
	let diff = [];

	m2.roles.cache.forEach((r) => {
		if (!m1.roles.cache.has(r.id)) diff.push(r);
	});
	return diff.length > 0 ? diff : null;
}

function getRoleRemove(m1, m2) {
	let diff = [];

	m1.roles.cache.forEach((r) => {
		if (!m2.roles.cache.has(r.id)) diff.push(r);
	});
	return diff.length > 0 ? diff : null;
}

module.exports = class GuildMemberUpdateEvent extends BaseEvent {
	constructor() {
		super("guildMemberUpdate");
		this.connection = StateManager.connection;
	}

	async run(client, oldMember, newMember) {
		const lang = await getLang(newMember.guild.id, this.connection);
		const diff = getRoleDiff(oldMember, newMember);

		if (diff) {
			const actionLogId = await fetchActionLog(
				this.connection,
				newMember.guild.id
			);
			if (actionLogId == "null") {
				return;
			} else if (actionLogId == null) {
				return;
			} else {
				const embed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle(`${capitalize(getString(lang, "new_action"))}`)
					.setDescription(
						`${capitalize(getString(lang, "event"))}: \`Guild member update\``
					)
					.setColor(colour())
					.addField("User", `<@${newMember.id}>`)
					.addField("Role added:", `${diff}`)
					.addField(
						"Roles before",
						`${oldMember.roles.cache.map((r) => `${r}`).join(" | ")}`
					)
					.addField(
						"Roles after",
						`${newMember.roles.cache.map((r) => `${r}`).join(" | ")}`
					)
					.setTimestamp()
					.setThumbnail(newMember.guild.iconURL({ dynamic: true }))
					.setFooter(
						`Role added | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return client.channels.cache.get(actionLogId).send(embed);
			}
		}
		const removed = getRoleRemove(oldMember, newMember);

		if (removed) {
			const actionLogId = await fetchActionLog(
				this.connection,
				newMember.guild.id
			);
			if (actionLogId === "null") {
				return;
			} else if (actionLogId === null) {
				return;
			} else {
				const embed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle(`${capitalize(getString(lang, "new_action"))}`)
					.setDescription(
						`${capitalize(getString(lang, "event"))}: \`Guild member update\``
					)
					.setColor(colour())
					.addField("User", `<@${newMember.id}>`)
					.addField("Role added:", `${removed}`)
					.addField(
						"Roles before",
						`${oldMember.roles.cache.map((r) => `${r}`).join(" | ")}`
					)
					.addField(
						"Roles after",
						`${newMember.roles.cache.map((r) => `${r}`).join(" | ")}`
					)
					.setTimestamp()
					.setThumbnail(newMember.guild.iconURL({ dynamic: true }))
					.setFooter(
						`Role added | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				client.channels.cache.get(actionLogId).send(embed);
			}
		}
		if (oldMember.nickname !== newMember.nickname) {
			const actionLogId = await fetchActionLog(
				this.connection,
				newMember.guild.id
			);
			if (actionLogId == null) {
				return;
			} else {
				let newNickname = newMember.nickname;
				let oldNickname = oldMember.nickname;

				if (newNickname == null) {
					newNickname = newMember.user.username;
				}
				if (oldNickname == null) {
					oldNickname = oldMember.user.username;
				}
				const embed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle(`${capitalize(getString(lang, "new_action"))}`)
					.setDescription(
						`${capitalize(getString(lang, "event"))}: \`Guild member update\``
					)
					.setColor(colour())
					.addField("User", `<@${newMember.id}>`)
					.addField("Old nickname:", `\`${oldNickname}\``)
					.addField("New nickname:", `\`${newNickname}\``)
					.setTimestamp()
					.setThumbnail(newMember.guild.iconURL({ dynamic: true }))
					.setFooter(
						`Role added | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return client.channels.cache.get(actionLogId).send(embed);
			}
		}
	}
};
