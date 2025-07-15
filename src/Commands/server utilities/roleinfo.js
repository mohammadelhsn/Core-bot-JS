const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");

module.exports = class RoleInfoCommand extends BaseCommand {
	constructor() {
		super(
			"roleinfo",
			"server utilities",
			["ri"],
			"<mention>",
			"Gives role information about the mentioned role",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["roleinfo @Bots"],
			true,
			2000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const role =
			message.guild.roles.cache.find((r) => r.name === args[0]) ||
			message.guild.roles.cache.find((r) => r.id === args[0]) ||
			message.mentions.roles.first();

		const roleinfo = {
			name: `\`${role.name}\``,
			colour: `\`${role.hexColor}\``,
			id: `\`${role.id}\``,
			guild: `${role.guild.name}`,
			managed: `\`${role.managed ? "Yes" : "No"}\``,
			deleted: `\`${role.deleted ? "Yes" : "No"}\``,
			createdAt: `\`${role.createdAt}\``,
		};

		if (role) {
			const roleInfoEmbed = BaseEmbed(client, message, this)
				.setTitle(`${roleinfo.guild} role information`)
				.setDescription(
					`${roleinfo.name} roleinfo\n-------------------\nRole colour: ${roleinfo.colour}\nRole managed? ${roleinfo.managed}\nRole deleted ${roleinfo.deleted}\nRole created at: ${roleinfo.createdAt}\nRole ID: ${roleinfo.id}`
				)
				.setColor(roleinfo.colour);
			return message.channel.send(roleInfoEmbed);
		} else if (args[0].toLowerCase() == "help") {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		} else {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}
	}
};
