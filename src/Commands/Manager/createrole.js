const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseSuccessEmbed,
	BaseEmbed,
} = require("../../utils/structures/functions");

module.exports = class CaseCommand extends BaseCommand {
	constructor() {
		super(
			"createrole",
			"manager",
			["newrole", "makerole"],
			"",
			"Create a new role",
			"",
			["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES", "ADMINISTRATOR"],
			[],
			[],
			true,
			10000,
			false,
			false,
			["MANAGE_ROLES", "ADMINISTRATOR"],
			""
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;

		if (!message.member.hasPermission(["MANAGE_ROLES" || "ADMINISTRATOR"])) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: You don't have the permissions to use this command.```"
			);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (!message.guild.me.hasPermission(["MANAGE_ROLES" || "ADMINISTRATOR"])) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				"```Error details: I don't have the permissions required to complete this for you```"
			);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const colour = args[0];
		const name = args.slice(1).join(" ");

		if (!colour) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				"```Error details: Please mention a colour hex code```"
			);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (!name) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				"```Error details: Please mention a name for the role```"
			);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}

		try {
			const role = await message.guild.roles.create({
				data: {
					color: colour,
					name: name,
				},
			});

			const embed = await BaseSuccessEmbed(client, message, self);
			embed.setDescription(`Role <@&${role.id}> successfully created.`);
			return message.channel.send(embed);
		} catch (e) {
			console.log(e);

			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				"```Error details: An unexpected error has occurred```"
			);
			return message.channel.send(errEmbed);
		}
	}
};
