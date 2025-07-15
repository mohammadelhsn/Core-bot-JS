const BaseCommand = require("../../utils/structures/BaseCommand");
const {
	BaseHelpEmbed,
	BaseEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
} = require("../../utils/structures/functions");

module.exports = class AdminRoleCommand extends BaseCommand {
	constructor() {
		super(
			"adminrole",
			"config",
			["adminr"],
			"(enable || disable || help) (role)",
			"Configure the admin role for the guild",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS", "ADMINISTRATOR"],
			[
				"adminrole enable` - Enable the admin role for the guild",
				"adminrole disable` - Disable the admin role for the guild",
				"adminrole current - View the current settings",
				"adminrole help` - Sends the help embed",
			],
			[
				"adminrole",
				"adminrole enable @Admin",
				"adminrole disable",
				"adminrole help",
			],
			true,
			10000,
			false,
			false,
			["ADMINISTRATOR"],
			"Working"
		);
	}
	async run(client, message, args) {
		if (!message.member.hasPermission(["ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`\nError details: Missing permissions.\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`\nError details: I am missing permissions.\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (!args[0]) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`\nError details: Missing a required argument\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (args[0].toLowerCase().includes("enable")) {
			if (!args[1]) {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`\nError details: Role is a required argument for this to function\`\`\``
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
				errorEmbed.setDescription(`\`\`\`Error details: No role found!\`\`\``);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			if (role.name == "@everyone") {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`Error details: Cannot set admin role to @everyone\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			const result = await this.con.query(
				`SELECT adminRoleId FROM serverroles WHERE guildId = '${message.guild.id}'`
			);
			const adminrole = await result[0][0].adminRoleId;
			let value;
			if (adminrole === null) {
				value = "`Disabled`";
			} else if (adminrole === "null") {
				value = "`Disabled`";
			} else {
				let role = message.guild.roles.cache.find((r) => r.id === adminrole);
				value = role.name;
			}

			try {
				this.con.query(
					`UPDATE serverroles SET adminRoleId  = '${role.id}' WHERE guildId = '${message.guild.id}'`
				);
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`Error details: An unexpected error has occurred\`\`\``
				);
				return message.channel.send(errorEmbed);
			}
			const embed = await BaseSuccessEmbed(client, message, this);
			embed.setDescription(`Successfully updated!`);
			embed.addField("Old value:", `${value}`);
			embed.addField("New value:", `<@&${role.id}>`);
			return message.channel.send(embed);
		} else if (args[0].toLowerCase().includes("disable")) {
			const res = await this.con.query(
				`SELECT adminRoleId FROM serverroles WHERE guildId = '${message.guild.id}'`
			);
			const adminrole = await res[0][0].adminRoleId;
			const value = message.guild.roles.cache.find((r) => r.id === adminrole);

			if (adminrole === null) {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`\nError details: Admin role is already enabled\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			} else if (adminrole.toLowerCase() === "null") {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`Error details: Admin role is already enabled\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			} else {
				this.con.query(
					`UPDATE serverroles SET adminRoleId = 'null' WHERE guildId = '${message.guild.id}'`
				);

				const successEmbed = await BaseSuccessEmbed(client, message, this);
				successEmbed.setDescription(
					`Successfully updated admin role for ${message.guild.name}`
				);
				successEmbed.addField("Old value", `<@&${value.id}>`);
				successEmbed.addField("New value", `\`Disabled\``);
				return message.channel.send(successEmbed);
			}
		} else if (args[0].toLowerCase().includes("current")) {
			const result = await this.con.query(
				`SELECT adminRoleId FROM serverroles WHERE guildId = '${message.guild.id}'`
			);
			const adminrole = result[0][0].adminRoleId;
			let value;

			if (adminrole === null) {
				value = `${this.Emojis.off_switch} | \`Disabled\``;
			} else if (adminrole === "null") {
				value = `${this.Emojis.off_switch} | \`Disabled\``;
			} else {
				value = `${this.Emojis.on_switch} | <@${adminrole}>`;
			}

			const embed = BaseEmbed(client, message, this)
				.setTitle(`Admin-role command`)
				.setDescription(`Current settings for this guild: ${value}`);
			return message.channel.send(embed);
		} else {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				message: message,
				command: this,
			});
		}
	}
};
