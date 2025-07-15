const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseSuccessEmbed,
} = require("../../utils/structures/functions");

module.exports = class ProtectRoleCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"protectrole",
			"manager",
			["protectr"],
			"",
			"Adds a role to the protect list",
			"",
			[],
			[],
			[],
			true,
			10000,
			false,
			false,
			[],
			""
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const role =
			message.guild.roles.cache.find((r) => r.name === args[0]) ||
			message.guild.roles.cache.find((r) => r.id === args[0]) ||
			message.mentions.roles.first();

		if (!message.member.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
			const errorEmbed = BaseErrorEmbed(client, message)
				.setDescription(
					`Error details: \`You are missing permission(s) that are required for this command\``
				)
				.setFooter(
					`Protect-role command | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);
			return message.channel.send(errorEmbed);
		}

		if (!message.guild.me.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
			const errorEmbed = BaseErrorEmbed(client, message)
				.setDescription(
					`Error details: \`I am missing permission(s) required for this command\``
				)
				.setFooter(
					`Protect-role command | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);
			return message.channel.send(errorEmbed);
		}

		if (args[0] === undefined) {
			const errorEmbed = BaseErrorEmbed(client, message)
				.setDescription(
					`Error details: \`You must include this argument, it is requried!\``
				)
				.setFooter(
					`Protect-role command | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);
			return message.channel.send(errorEmbed);
		}

		if (!role) {
			const errorEmbed = BaseErrorEmbed(client, message)
				.setDescription(`Error details: \`Role doesn't exist\``)
				.setFooter(
					`Protect-role command | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);
			return message.channel.send(errorEmbed);
		}

		if (role.name === "@everyone") {
			const errorEmbed = BaseErrorEmbed(client, message)
				.setDescription(`Error details: \`I cannot do that\``)
				.setFooter(
					`Protect-role command | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);
			return message.channel.send(errorEmbed);
		}

		this.connection
			.query(
				`SELECT roleId FROM protectedRole WHERE guildId = '${message.guild.id}'`
			)
			.then((result) => {
				const roles = result[0].map((r) => r.roleId);

				const exist = roles.filter((r) => r == role.id)[0];

				if (exist) {
					const embed = BaseErrorEmbed(client, message)
						.setDescription(
							`\`\`\`\nError details: This role is already protected\`\`\``
						)
						.setFooter(
							`Protect-role command | ${client.user.username}`,
							client.user.displayAvatarURL({ dynamic: true })
						);
					return message.channel.send(embed);
				}

				this.connection.query(
					`INSERT INTO protectedRole (guildId, roleId) VALUES('${message.guild.id}', '${role.id}')`
				);

				const embed = BaseSuccessEmbed(client, message)
					.setDescription(`${role.name} is now protected`)
					.setFooter(
						`Protect-role command | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return message.channel.send(embed);
			});
	}
};
