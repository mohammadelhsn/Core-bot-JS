const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseSuccessEmbed,
	BaseErrorEmbed,
	BaseEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");

module.exports = class CaseCommand extends BaseCommand {
	constructor() {
		super(
			"deleterole",
			"manager",
			["delrole"],
			"<role>",
			"Delete a role from the guild.",
			"",
			["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES", "ADMINISTRATOR"],
			[],
			[],
			true,
			10000,
			false,
			false,
			["MANAGE_ROLES", "ADMINISTRATOR"],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
		const role =
			message.guild.roles.cache.find((r) => r.name === args[0]) ||
			message.guild.roles.cache.find((r) => r.id === args[0]) ||
			message.mentions.roles.first();

		if (!message.member.hasPermission(["MANAGE_ROLES" || "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: You don't have the permissions to use this command```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (!message.guild.me.hasPermission(["MANAGE_ROLES" || "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: I cannot complete this for you, I am missing the required permissions```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (!role) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription("```Error details: You must mention a role```");
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (role.id == message.guild.id) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: Cannot delete the @everyone role```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (role.managed) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: Role is managed by an external source.```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		try {
			role.delete();

			const embed = await BaseSuccessEmbed(client, message, self);
			embed.setDescription(`Successfully deleted role: \`${role.name}\``);
			return message.channel.send(embed);
		} catch (e) {
			console.log(e);

			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: An unexpected error has occurred```"
			);
			return message.channel.send(errorEmbed);
		}
	}
};
