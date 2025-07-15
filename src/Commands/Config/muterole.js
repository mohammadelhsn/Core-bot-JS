const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
} = require("../../utils/structures/functions");

module.exports = class MuteRoleCommand extends BaseCommand {
	constructor() {
		super(
			"muterole",
			"config",
			["muter"],
			"<enable || disable || current> (new value)",
			"Configure the muterole for the guild",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS", "ADMINISTRATOR"],
			[
				"muterole enable` - Enables the muterole for the guild",
				"muterole disable` - Disables the muterole for the guild",
				"muterole current` - View the current muterole for the guild",
			],
			["muterole current", "muterole disable", "muterole enable @Muted"],
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
					`\`\`\`\nError details: Cannot set mute-role to @everyone\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			const result = await this.connection.query(
				`SELECT muteRoleId FROM serverroles WHERE guildId = '${message.guild.id}'`
			);
			const muterole = await result[0][0].muteRoleId;
			let value;

			if (muterole === null) {
				value = "`Disabled`";
			} else if (muterole === "null") {
				value = "`Disabled`";
			} else {
				let role = message.guild.roles.cache.find((r) => r.id === muterole);
				value = role.name;
			}

			try {
				this.connection.query(
					`UPDATE serverroles SET muteRoleId  = '${role.id}' WHERE guildId = '${message.guild.id}'`
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
			embed.setDescription(`Sucessfully updated!`);
			embed.addField("Old value:", `${value}`);
			embed.addField("New value:", `<@&${role.id}>`);
			return message.channel.send(embed);
		} else if (args[0].toLowerCase().includes("disable")) {
			const res = await this.connection.query(
				`SELECT muteRoleId FROM serverroles WHERE guildId = '${message.guild.id}'`
			);
			const muterole = await res[0][0].muteRoleId;
			const value = message.guild.roles.cache.find((r) => r.id === muterole);

			if (muterole === null) {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`Error details: \`Mute-role is already enabled\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			} else if (muterole.toLowerCase() === "null") {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`Error details: \`Mute-role is already enabled\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			} else {
				this.connection.query(
					`UPDATE serverroles SET muteRoleId = 'null' WHERE guildId = '${message.guild.id}'`
				);

				const successEmbed = await BaseSuccessEmbed(client, message, this);
				successEmbed.setDescription(
					`Successfully updated mute-role for ${message.guild.name}`
				);
				successEmbed.addField("Old value", `<@&${value.id}>`);
				successEmbed.addField("New value", `\`Disabled\``);
				return message.channel.send(successEmbed);
			}
		} else if (args[0].toLowerCase().includes("current")) {
			const result = await this.connection.query(
				`SELECT muteRoleId FROM serverroles WHERE guildId = '${message.guild.id}'`
			);
			const muterole = await result[0][0].muteRoleId;
			let value;

			if (muterole === null) {
				value = `\`Disabled\``;
			} else if (muterole === "null") {
				value = `\`Disabled\``;
			} else {
				value = muterole;
			}

			const embed = BaseEmbed(client, message, this)
				.setTitle(`Mute-role command`)
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
