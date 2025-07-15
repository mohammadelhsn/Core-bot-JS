const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
	fetchInviteLog,
} = require("../../utils/structures/functions");

module.exports = class InviteLogCommand extends BaseCommand {
	constructor() {
		super(
			"invitelog",
			"logging",
			["il"],
			"(enable || disable || help) (mention)",
			"Configure the invite log for the guild",
			"Administrator",
			[],
			[],
			[],
			true,
			1000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
		if (!message.member.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```\nError details: You don't have the permissions to use this command!```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (!message.guild.me.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```\nError details: I don't have the permissions to fulfill this command for you!```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const toConfigure = args[0];

		if (!toConfigure) {
			try {
				const invitelog = await fetchInviteLog(
					this.connection,
					message.guild.id
				);

				if (invitelog == null) {
					const currentEmbed = BaseEmbed(client, message, self)
						.setTitle("Invite-log command")
						.setDescription(
							`Invite-log channel current settings: \`Disabled\``
						);
					return message.channel.send(currentEmbed);
				} else {
					const currentEmbed = BaseEmbed(client, message, self)
						.setTitle("Invite-log command")
						.setDescription(
							`Invite-log channel current settings: <#${invitelog}>`
						);
					return message.channel.send(currentEmbed);
				}
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```Error details: An unexpected error has occurred```"
				);
				return message.channel.send(errorEmbed);
			}
		} else if (toConfigure == "enable") {
			let mention = message.mentions.channels.first();
			if (!mention) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`\nError details: You are missing the channel mention!\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
			const newValue = mention.id;

			if (!newValue) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`\nError details: You must include the mention!\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
			try {
				this.connection.query(
					`UPDATE GuildLogging SET inviteLogId = '${newValue}' WHERE guildId = '${message.guild.id}'`
				);

				const embed = await BaseSuccessEmbed(client, message, self);
				embed.setDescription(
					`Successfully updated the Invite-log command to <#${newValue}>`
				);
				return message.channel.send(embed);
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```Error details: An unexpected error has occurred```"
				);
				return message.channel.send(errorEmbed);
			}
		} else if (toConfigure == "disable") {
			const invitelog = await fetchInviteLog(this.connection, message.guild.id);

			if (invitelog == null || invitelog == "null") {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					"```\nError details: Invite-log is already disabled for this server```"
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			} else {
				this.connection.query(
					`UPDATE GuildLogging SET inviteLogId = 'null' WHERE guildId = '${message.guild.id}'`
				);

				const disabledEmbed = BaseEmbed(client, message, this).setDescription(
					"Success! Invite-log chanel has been disabled."
				);
				return message.channel.send(disabledEmbed);
			}
		} else if (toConfigure == "help") {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const invalidChoice = await BaseErrorEmbed(client, message, this);
			invalidChoice.setDescription(
				`\`\`\`\nError details: Invalid choice\`\`\``
			);
			const msg = await message.channel.send(invalidChoice);
			return msg.delete({ timeout: 10000 });
		}
	}
};
