const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const { colour, fetchInviteLog } = require("../../utils/structures/functions");

module.exports = class InviteCreateEvent extends (
	BaseEvent
) {
	constructor() {
		super("inviteCreate");
		this.connection = StateManager.connection;
	}
	async run(client, invite) {
		const guild = invite.guild;

		const actionlog = await fetchInviteLog(this.connection, guild.id);

		if (actionlog == null) {
			return;
		} else {
			const embed = new MessageEmbed()
				.setAuthor(
					client.user.username,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setTitle("New action")
				.setDescription(`Event: \`Invite created\``)
				.addField("Code:", `\`${invite.code}\``)
				.addField("Invite URL", `${invite.url}`)
				.addField("Channel", `${invite.channel}`)
				.addField("Inviter", `<@${invite.inviter.id}>`)
				.setTimestamp()
				.setColor(colour())
				.setThumbnail(guild.iconURL({ dynamic: true }))
				.setFooter(
					`Invite created | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);

			return client.channels.cache.get(actionlog).send(embed);
		}
	}
};
