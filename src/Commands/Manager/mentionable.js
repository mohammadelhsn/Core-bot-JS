const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseSuccessEmbed,
} = require("../../utils/structures/functions");

module.exports = class CaseCommand extends BaseCommand {
	constructor() {
		super(
			"mentionable",
			"manager",
			["mention"],
			"<@role> <true | false> ",
			"Changes mentionable settings on the mentioned role",
			"Administrator",
			["MANAGE_ROLES", "SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["mentionable false @Bots", "mentionable true @Bots"],
			true,
			10000,
			false,
			false,
			["MANAGE_ROLES"],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		if (!message.member.hasPermission(["MANAGE_ROLES" || "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: You are missing the required permissions\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (!message.guild.me.hasPermission("MANAGE_ROLES" || "ADMINISTRATOR")) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: I don't have the required permissions to fulfill this command\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		let setting = args[0];
		const s = args.slice(1).join(" ");

		const role =
			message.guild.roles.cache.find(
				(r) => r.name.toLowerCase() === s.toLowerCase()
			) ||
			message.guild.roles.cache.find((r) => r.id === s) ||
			message.mentions.roles.first();

		if (!role) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(`\`\`\`Error details: Cannot find role\`\`\``);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (setting.toLowerCase().includes("true")) {
			if (role.mentionable === true) {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`Error details: Role is already mentionable\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
			try {
				role.setMentionable(true);

				const embed = await BaseSuccessEmbed(client, message, this);
				embed.setDescription(
					`Successfully set <@&${role.id}> to \`mentionable\``
				);
				return message.channel.send(embed);
			} catch (e) {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`Error details: An unexpected error has occurred!\`\`\``
				);
				return message.channel.send(errorEmbed);
			}
		} else if (setting.toLowerCase().includes("false")) {
			if (role.mentionable === false) {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`Error details: Role is already not mentionable\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			try {
				role.setMentionable(false);

				const embed = await BaseSuccessEmbed(client, message, this);
				embed.setDescription(
					`Successfully set <@&${role.id}> to \`unmentionable\``
				);
				return message.channel.send(embed);
			} catch (e) {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`Error details: An unexpected error has occurred!\`\`\``
				);
				return message.channel.send(errorEmbed);
			}
		} else {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: Invalid option <true | false> \`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
	}
};
