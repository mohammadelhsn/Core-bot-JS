const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const { success_emoji, error_emoji } = require("../../../emojis.json");
const dateFormat = require("dateformat");
const moment = require("moment");
const {
	BaseErrorEmbed,
	BaseSuccessEmbed,
	BaseHelpEmbed,
	fetchModeration,
	fetchModlog,
	fetchPublicModlog,
	BaseEmbed,
	capitalize,
} = require("../../utils/structures/functions");

module.exports = class CaseCommand extends BaseCommand {
	constructor() {
		super(
			"case",
			"moderation",
			[],
			"",
			"View / update the case on a moderation",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			[],
			true,
			1000,
			false,
			false,
			["BAN_MEMBERS", "ADMINISTRATOR"],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
		if (!message.member.hasPermission(["BAN_MEMBERS" || "ADMINISTRATOR"])) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: You are missing the required permissions\`\`\``
			);
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}
		if (!message.guild.me.hasPermission(["MANAGE_GUILD" || "ADMINISTRATOR"])) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: I am missing the required permissions\`\`\``
			);
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}

		const caseNumber = args[0];

		const reason = args.slice(1).join(" ");

		if (!caseNumber) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: You need to mention a case number\`\`\``
			);
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}
		if (caseNumber == "help") {
			return await BaseHelpEmbed(client, message, self);
		}
		if (isNaN(caseNumber)) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: Provided value is not a number\`\`\``
			);
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}

		if (reason) {
			const moderation = await fetchModeration(
				message.guild.id,
				caseNumber,
				this.connection
			);

			if (!moderation) {
				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(
					`\`\`\`Error details: Couldn't find this case number\`\`\``
				);
				const m = await message.channel.send(errEmbed);
				return m.delete({ timeout: 10000 });
			}

			const modlog = await fetchModlog(this.connection, message.guild.id);
			const publicmodlog = await fetchPublicModlog(
				this.connection,
				message.guild.id
			);

			const obj = {
				dbUpdated: false,
				modlogmsg: false,
				pModlogmsg: false,
				modlog_msg: null,
				pModlog_msg: null,
			};

			try {
				this.connection.query(
					`UPDATE GuildModerations SET reason = '${reason}' WHERE guildId = '${message.guild.id}' AND caseNumber = '${caseNumber}'`
				);
				this.connection.query(
					`UPDATE GuildModerations SET lastUpdated = '${Date.now()}' WHERE guildId = '${
						message.guild.id
					}' AND caseNumber = '${caseNumber}'`
				);
				this.connection.query(
					`UPDATE GuildModerations SET updatedBy = '${message.author.id}' WHERE guildId = '${message.guild.id}' AND caseNumber = '${caseNumber}'`
				);
			} catch (e) {
				console.log(e);

				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(
					`\`\`\`Error details: An unexpected error has occurred\`\`\``
				);
				return message.channel.send(errEmbed);
			}

			obj.dbUpdated = true;

			try {
				let m;
				let p;

				if (moderation.modLogId == null || moderation.modLogId == "null") {
					m = "Modlog disabled";
				} else {
					if (moderation.messageId == null || moderation.messageId == "null") {
						m = "No message";
					} else {
						m = "Working";
						const mChannel = await client.channels.cache.get(modlog);
						const msg = await mChannel.messages.fetch({
							around: moderation.messageId,
							limit: 1,
						});
						if (!msg) {
							const errEmbed = await BaseErrorEmbed(client, message, self);
							errEmbed.setDescription(
								`\`\`\`Error details: I couldn't find the stored message\`\`\``
							);
							const m = await message.channel.send(errEmbed);
							return m.delete({ timeout: 10000 });
						} else {
							const embed = msg.first().embeds[0];
							if (!embed) {
								const errEmbed = await BaseErrorEmbed(client, message, self);
								errEmbed.setDescription(
									`\`\`\`Error details: Could not find embed\`\`\``
								);
								const m = await message.channel.send(embed);
								return m.delete({ timeout: 10000 });
							} else {
								embed.fields[2] = { name: "Reason", value: `\`${reason}\`` };
								msg.first().edit(embed);

								obj.modlogmsg = true;
								obj.modlog_msg = `[Case #${caseNumber}](https://discorapp.com/channels/${message.guild.id}/${modlog}/${moderation.messageId})`;
							}
						}
					}
				}

				if (
					moderation.publicLogId == null ||
					moderation.publicLogId == "null"
				) {
					p = "No channel";
				} else {
					if (moderation.publicMessageId == null) {
						p = "No message";
					} else {
						p = "Working?";
						const pmChannel = await client.channels.cache.get(publicmodlog);
						const msg = await pmChannel.messages.fetch({
							around: moderation.publicMessageId,
							limit: 1,
						});
						if (!msg) {
							const em = await BaseErrorEmbed(client, message, self);
							em.setDescription(
								`\`\`\`Error details: I couldn't find the stored message\`\`\``
							);
							const m = await message.channel.send(em);
							return m.delete({ timeout: 10000 });
						} else {
							const embed = msg.first().embeds[0];
							if (!embed) {
								const errEmbed = await BaseErrorEmbed(client, message, self);
								errEmbed.setDescription(
									`\`\`\`Error details: No embed found\`\`\``
								);
								const m = await message.channel.send(errEmbed);
								return m.delete({ timeout: 10000 });
							} else {
								embed.fields[2] = { name: "Reason", value: `\`${reason}\`` };
								msg.first().edit(embed);

								obj.pModlogmsg = true;
								obj.pModlog_msg = `[Case #${caseNumber}](https://discordapp.com/channels/${message.guild.id}/${publicmodlog}/${moderation.publicMessageId})`;
							}
						}
					}
				}

				const successEmbed = await BaseSuccessEmbed(client, message, self);
				successEmbed.setDescription(`Successfully updated Case #${caseNumber}`);
				successEmbed.addField(
					"Database",
					`${obj.dbUpdated == false ? `${error_emoji}` : `${success_emoji}`}`
				);
				successEmbed.addField(
					"Modlog",
					`${
						obj.modlogmsg == false
							? `${error_emoji} | Error: \`Modlog is disabled\``
							: `${success_emoji} | ${obj.modlog_msg}`
					}`
				);
				successEmbed.addField(
					"Public modlog",
					`${
						obj.pModlogmsg == false
							? `${error_emoji} | Error: \`Public modlog is disabled\``
							: `${success_emoji} | ${obj.pModlog_msg}`
					}`
				);
				return message.channel.send(successEmbed);
			} catch (e) {
				console.log(e);

				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(
					`\`\`\`Error details: An unexpected error occurred\`\`\``
				);
				return message.channel.send(errEmbed);
			}
		} else {
			try {
				const moderation = await fetchModeration(
					message.guild.id,
					`${caseNumber}`,
					this.connection
				);

				if (!moderation) {
					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription(
						`\`\`\`Error details: No moderation found\`\`\``
					);
					const msg = await message.channel.send(errEmbed);
					return msg.delete({ timeout: 10000 });
				}

				const modlog = await fetchModlog(this.connection, message.guild.id);
				const publicmodlog = await fetchModlog(
					this.connection,
					message.guild.id
				);
				let m;
				if (modlog == null || modlog == "null") {
					m = null;
				} else {
					if (moderation.messageId == null || moderation.messageId == "null") {
						m = null;
					} else {
						m = `[JUMP TO MESSAGE](https://discordapp.com/channels/${message.guild.id}/${modlog}/${moderation.messageId})`;
					}
				}
				let p;
				if (publicmodlog == null) {
					p = null;
				} else {
					if (moderation.publicMessageId == "null") {
						p = null;
					} else {
						p = `[JUMP TO MESSAGE](https://discordapp.com/channels/${message.guild.id}/${publicmodlog}/${moderation.publicMessageId})`;
					}
				}

				let user;
				if (moderation.userId !== "null") {
					user = await client.users.fetch(moderation.userId);
				} else {
					user = null;
				}

				const embed = BaseEmbed(client, message, self);
				embed.setDescription(`Case #\`${moderation.caseNumber}\``);
				embed.addField(
					"Moderation",
					`\`${capitalize(moderation.moderation)}\``
				);
				embed.addField(
					"Reason",
					`\`${moderation.reason == "null" ? "N/A" : moderation.reason}\``
				);
				embed.addField(
					"Moderator ID",
					`${
						moderation.moderatorId == "null"
							? "`N/A`"
							: `<@${moderation.moderatorId}> - (\`${moderation.moderatorId}\`)`
					}`
				);
				embed.addField(
					"User ID",
					`${user ? `**${user.tag}** - (\`${user.id}\`)` : "`N/A`"}`
				);
				embed.addField(
					"Last updated by:",
					`<@${moderation.updatedBy}> - (\`${moderation.updatedBy}\`)`
				);
				embed.addField(
					"Moderation date:",
					`\`${moment(parseInt(moderation.moderationDate)).format(
						"MMMM Do YYYY, h:mm:ss a"
					)}\``
				);
				embed.addField(
					"Last updated at:",
					`\`${moment(parseInt(moderation.lastUpdated)).format(
						"MMMM Do YYYY, h:mm:ss a"
					)}\``
				);
				embed.addField("Modlog message", `${m ? m : "`N/A`"}`);
				embed.addField("Public modlog message", `${p ? p : `\`N/A\``}`);
				embed.setThumbnail(
					user
						? user.displayAvatarURL({ dynamic: true })
						: message.guild.iconURL({ dynamic: true })
				);
				return message.channel.send(embed);
			} catch (e) {
				console.log(e);

				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(
					`\`\`\`Error details: An unexpected error occurred\`\`\``
				);
				return message.channel.send(errEmbed);
			}
		}
	}
};
