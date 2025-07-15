const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const {
	colour,
	getString,
	fetchRoleLog,
	getLang,
	capitalize,
} = require("../../utils/structures/functions");

module.exports = class GuildRoleDeleteEvent extends (
	BaseEvent
) {
	constructor() {
		super("roleDelete");
		this.connection = StateManager.connection;
	}
	async run(client, role) {
		const lang = await getLang(role.guild.id, this.connection);
		const actionlog = await fetchRoleLog(this.connection, role.guild.id);

		if (actionlog == null) {
			return;
		} else {
			const embed = new MessageEmbed()
				.setAuthor(
					client.user.username,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setTitle(`${capitalize(getString(lang, "new_action"))}`)
				.setDescription(
					`${capitalize(getString(lang, "event"))}: \`Role deleted\``
				)
				.addField("Role name", `\`${role.name}\``)
				.addField("Role ID", `\`${role.id}\``)
				.addField("Role colour", `\`${role.hexColor}\``)
				.setColor(role.hexColor)
				.setTimestamp()
				.setThumbnail(role.guild.iconURL({ dynamic: true }))
				.setFooter(
					`Role delete | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);

			try {
				return client.channels.cache.get(actionlog).send(embed);
			} catch (e) {
				return console.log(e);
			}
		}
	}
};
