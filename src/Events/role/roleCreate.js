const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const {
	colour,
	fetchRoleLog,
	getString,
	getLang,
	capitalize,
} = require("../../utils/structures/functions");

module.exports = class GuildRoleCreateEvent extends (
	BaseEvent
) {
	constructor() {
		super("roleCreate");
		this.connection = StateManager.connection;
	}
	async run(client, role) {
		const lang = await getLang(role.guild.id, this.connection);
		const actionLog = await fetchRoleLog(this.connection, role.guild.id);

		if (actionLog == null) {
			return;
		} else {
			const embed = new MessageEmbed()
				.setAuthor(
					client.user.username,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setTitle(`${capitalize(getString(lang, "new_action"))}`)
				.setDescription(
					`${capitalize(getString(lang, "event"))}: \`Role created\``
				)
				.addField("Role:", `<@&${role.id}>`)
				.addField("Role name", `\`${role.name}\``)
				.addField("Role ID", `\`${role.id}\``)
				.addField("Role colour", `${role.hexColor}`)
				.setColor(role.hexColor)
				.setTimestamp()
				.setThumbnail(role.guild.iconURL({ dynamic: true }))
				.setFooter(
					`Role created | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);

			try {
				return client.channels.cache.get(actionLog).send(embed);
			} catch (err) {
				return console.log(e);
			}
		}
	}
};
