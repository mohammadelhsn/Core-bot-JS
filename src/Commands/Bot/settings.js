const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseEmbed,
	fetchPrefix,
	fetchMemberLog,
	fetchModlog,
	fetchRoleLog,
	fetchAppeals,
	fetchReports,
	fetchActionLog,
	fetchSuggestions,
	fetchMessageLog,
	fetchServerLog,
	fetchInviteLog,
	fetchEmojiLog,
	fetchChannelLog,
	fetchPublicModlog,
} = require("../../utils/structures/functions");

module.exports = class SettingsCommand extends BaseCommand {
	constructor() {
		super(
			"settings",
			"bot",
			[],
			"",
			"View all the current settings for the guild",
			"",
			["MANAGE_GUILD", "ADMINISTRATOR"],
			"",
			"",
			true,
			3000,
			false,
			false,
			["MANAGE_GUILD", "ADMINISTRATOR"],
			"WIP"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;

		if (!message.member.hasPermission(["MANAGE_GUILD" || "ADMINISTRATOR"])) {
			const errEmbed = BaseErrorEmbed(client, message, self).setDescription(
				"```Error details: You don't have the right permissions for this command```"
			);
			return message.channel.send(errEmbed);
		}

		if (args[0]) {
			return await BaseHelpEmbed(client, message, self);
		}
		try {
			const res = await this.connection.query(
				`SELECT isEnabled FROM welcomesystem WHERE guildId = '${message.guild.id}'`
			);
			const ress = await this.connection.query(
				`SELECT media FROM welcomesystem WHERE guildId = '${message.guild.id}'`
			);
			const response = await this.connection.query(
				`SELECT welcomeMessage FROM welcomesystem WHERE guildId = '${message.guild.id}'`
			);
			const result = await this.connection.query(
				`SELECT welcomeChannelId FROM welcomesystem WHERE guildId = '${message.guild.id}'`
			);
			const results = await this.connection.query(
				`SELECT isEnabled FROM leavesystem WHERE guildId = '${message.guild.id}'`
			);
			const resss = await this.connection.query(
				`SELECT media FROM leavesystem WHERE guildId = '${message.guild.id}'`
			);
			const responses = await this.connection.query(
				`SELECT leaveMessage FROM leavesystem WHERE guildId = '${message.guild.id}'`
			);
			const resultss = await this.connection.query(
				`SELECT leaveChannelId FROM leavesystem WHERE guildId = '${message.guild.id}'`
			);

			const settings = {
				prefix: await fetchPrefix(this.connection, message.guild.id),
				welcome: {
					enabled: await res[0][0].isEnabled,
					media: await ress[0][0].media,
					w_message: await response[0][0].welcomeMessage,
					w_channel: await result[0][0].welcomeChannelId,
				},
				leave: {
					enabled: await results[0][0].isEnabled,
					media: await resss[0][0].media,
					l_message: await responses[0][0].leaveMessage,
					l_channel: await resultss[0][0].leaveChannelId,
				},
				log: {
					member: await fetchMemberLog(this.connection, message.guild.id),
					modlog: await fetchModlog(this.connection, message.guild.id),
					rolelog: await fetchRoleLog(this.connection, message.guild.id),
					appeals: await fetchAppeals(this.connection, message.guild.id),
					reports: await fetchReports(this.connection, message.guild.id),
					actionlog: await fetchActionLog(this.connection, message.guild.id),
					suggestions: await fetchSuggestions(
						this.connection,
						message.guild.id
					),
					messagelog: await fetchMessageLog(this.connection, message.guild.id),
					serverlog: await fetchServerLog(this.connection, message.guild.id),
					invitelog: await fetchInviteLog(this.connection, message.guild.id),
					emojilog: await fetchEmojiLog(this.connection, message.guild.id),
					channellog: await fetchChannelLog(this.connection, message.guild.id),
					publicmodlog: await fetchPublicModlog(
						this.connection,
						message.guild.id
					),
				},
			};

			const embed = BaseEmbed(client, message, self)
				.setDescription(`Settings for: \`${message.guild.name}\``)
				.addField("Prefix:", `\`${settings.prefix}\``)
				.addField(
					"Welcome:",
					`Enabled: ${
						settings.welcome.enabled == 0 ? `\`Disabled\`` : `\`Enabled\``
					}\nMedia: ${
						settings.welcome.media == null
							? "`N/A`"
							: `\`${settings.welcome.media}\``
					}\nMessage: ${
						settings.welcome.w_message == null
							? `\`N/A\``
							: `\`${settings.welcome.w_message}\``
					}\nChannel: ${
						settings.welcome.w_channel == null
							? "`N/A`"
							: `<#${settings.welcome.w_channel}>`
					}`,
					true
				)
				.addField(
					"Leave:",
					`Enabled: ${
						settings.leave.enabled == 0 ? `\`Disabled\`` : `\`Enabled\``
					}\nMedia: ${
						settings.leave.media == null
							? "`N/A`"
							: `\`${settings.leave.media}\``
					}\nMessage: ${
						settings.leave.l_message == null
							? `\`N/A\``
							: `\`${settings.leave.l_message}\``
					}\nChannel: ${
						settings.leave.l_channel == null
							? "`N/A`"
							: `<#${settings.leave.l_channel}>`
					}`,
					true
				);
			return message.channel.send(embed);
		} catch (e) {
			console.log(e);

			const errEmbed = BaseErrorEmbed(client, message, self).setDescription(
				"```Error details: An unexpected error has occurred```"
			);
			return message.channel.send(errEmbed);
		}
	}
};
