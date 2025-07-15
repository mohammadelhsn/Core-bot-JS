const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
} = require("../../utils/structures/functions");

module.exports = class ModRoleCommand extends BaseCommand {
	constructor() {
		super(
			"modrole",
			"config",
			["modr"],
			"<enable || disable || current> (new value)",
			"Configure the modrole for the guild",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS", "ADMINISTRATOR"],
			[
				"modrole enable` - Enable the modrole for the guild",
				"modrole disable` - Disables the modrole for the guild",
				"modrole current` - Displays the current modrole for the guild",
			],
			["modrole current", "modrole disable", "modrole enable @Mod"],
			true,
			10000,
			false,
			false,
			["ADMINISTRATOR"],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		if (!message.member.hasPermission(["ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(`Error details: \`Missing permissions.\``);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(`Error details: \`I am missing permissions.\``);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (!args[0]) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`Error details: \`Missing a required argument\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (args[0].toLowerCase().includes("enable")) {
			if (!args[1]) {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`Error details: \`Role is a required argument for this to function\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			const role =
				message.guild.roles.cache.find(
					(r) => r.name.toLowerCase() === args[1].toLowerCase()
				) ||
				message.guild.roles.cache.find((r) => r.id === args[1]) ||
				message.mentions.roles.first();

			if (!role) {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(`Error details: \`No role found!\``);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			if (role.name === "@everyone") {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`\nError details: Cannot set mod-role to @everyone\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			const result = await this.connection.query(
				`SELECT modRoleId FROM serverroles WHERE guildId = '${message.guild.id}'`
			);

			const modrole = await result[0][0].modRoleId;
			let value;

			if (modrole === null) {
				value = "`Disabled`";
			} else if (modrole === "null") {
				value = "`Disabled`";
			} else {
				let role = message.guild.roles.cache.find((r) => r.id === modrole);
				value = role.name;
			}

			try {
				this.connection.query(
					`UPDATE serverroles SET modRoleId  = '${role.id}' WHERE guildId = '${message.guild.id}'`
				);
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`Error details: \`An unexpected error has occurred\``
				);
				return message.channel.send(errorEmbed);
			}
			const embed = await BaseSuccessEmbed(client, message, this);
			embed.addField("Old value:", `${value}`);
			embed.addField("New value:", `<@&${role.id}>`);
			return message.channel.send(embed);
		} else if (args[0].toLowerCase().includes("disable")) {
			const res = await this.connection.query(
				`SELECT modRoleId FROM serverroles WHERE guildId = '${message.guild.id}'`
			);
			const modrole = await res[0][0].modRoleId;
			const value = message.guild.roles.cache.find((r) => r.id === modrole);

			if (modrole === null) {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`Error details: \`Mod-role is already enabled\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			} else if (modrole.toLowerCase() === "null") {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`Error details: \`Mod-role is already enabled\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			} else {
				this.connection.query(
					`UPDATE serverroles SET modRoleId = 'null' WHERE guildId = '${message.guild.id}'`
				);

				const successEmbed = await BaseSuccessEmbed(client, message, this);
				successEmbed.setDescription(
					`Successfully updated mod-role for ${message.guild.name}`
				);
				successEmbed.addField("Old value", `<@&${value.id}>`);
				successEmbed.addField("New value", `\`Disabled\``);
				return message.channel.send(successEmbed);
			}
		} else if (args[0].toLowerCase().includes("current")) {
			const result = await this.connection.query(
				`SELECT modRoleId FROM serverroles WHERE guildId = '${message.guild.id}'`
			);
			const modrole = await result[0][0].modRoleId;
			let value;

			if (modrole === null) {
				value = `\`Disabled\``;
			} else if (modrole === "null") {
				value = `\`Disabled\``;
			} else {
				value = modrole;
			}

			const embed = BaseEmbed(client, message, this)
				.setTitle(`Mod-role command`)
				.setDescription(`Current settings for this guild: ${value}`);
			return message.channel.send(embed);
		} else {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(`Error details: \`Invalid choice\``);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
	}
};
