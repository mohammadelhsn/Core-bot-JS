const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const ms = require("ms");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
	fetchModlog,
	fetchPublicModlog,
	getString,
	getLang,
} = require("../../utils/structures/functions");

module.exports = class MuteCommand extends BaseCommand {
	constructor() {
		super(
			"mute",
			"moderation",
			[],
			"!mute <user> (time) (reason)",
			"Mutes the mentioned user for an optional time",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["mute @Tech! Spam", "mute @Tech! 20m pinging owner"],
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
		const lang = await getLang(message.guild.id, this.connection);
		let user =
			message.guild.members.cache.find((r) => r.name === args[0]) ||
			message.guild.members.cache.find((r) => r.id === args[0]) ||
			message.mentions.members.first();
		let time = args[1];
		let reason = args.slice(2).join(" ");

		var regex = /\d/g;
		const t = regex.test(time);

		if (t === true) {
			reason = args.slice(2).join(" ");
			time = args[1];
		} else {
			time = null;
			reason = args.slice(1).join(" ");
		}

		if (!user) {
			const errorEmbed = await BaseErrorEmbed(
				client,
				message,
				self
			).setDescription(`Error details: \`User not found\``);
			return message.channel.send(errorEmbed);
		}

		if (!message.member.hasPermission(["MANAGE_ROLES" || "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"Error details: `You don't have the permissions to use the command`"
			);
			return message.channel.send(errorEmbed);
		}
		if (!message.guild.me.hasPermission(["MANAGE_ROLES" || "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"Error details: `I do not have the permissions required!`"
			);
			return message.channel.send(errorEmbed);
		}
		if (user.user.id === client.user.id) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription("Error details: `I cannot mute myself`");
			return message.channel.send(errorEmbed);
		}
		if (user.user.id === "398264990567628812") {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription("Error details: `I cannot mute my owner`");
			return message.channel.send(errorEmbed);
		}
		if (user.user.id === message.author.id) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(`Error details: \`You cannot mute yourself!\``);
			return message.channel.send(errorEmbed);
		}

		if (user.roles.highest.position >= message.member.roles.highest.position) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`Error details: \`Your role is not high enough!\``
			);
			return message.channel.send(errorEmbed);
		}

		if (
			user.roles.highest.position >= message.guild.me.roles.highest.position
		) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`Error details: \`My role is not high enough to mute this user.\``
			);
			return message.channel.send(errorEmbed);
		}

		if (!reason) reason = "No reason given";

		if (time === null) {
			let muterole;

			const result = await this.connection.query(
				`SELECT muteRoleId FROM serverroles WHERE guildId = '${message.guild.id}'`
			);
			 muterole = await result[0][0].muteRoleId;

			if (muterole === null) {
				return;
			} else if (muterole === "null") {
				return;
			} else {
				try {
					if (user.roles.cache.has(muterole)) {
						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription(
							`Error details: \`User is already muted!\``
						);
						return message.channel.send(errorEmbed);
					}
					user.roles.add(muterole).then(async () => {
						const dmEmbed = BaseEmbed(client, message, self)
							.setTitle(`Mute notification`)
							.setDescription(
								`You have been muted in \`${message.guild.name}\` for \`${reason}\`. `
							);
						try {
							user.send(dmEmbed);
						} catch (e) {
							console.log(e);

							const errEmbed = await BaseErrorEmbed(client, message, self);
							errEmbed.setDescription(
								`\`\`\`Error details: Unable to DM this user!\`\`\``
							);
						}
						const successEmbed = await BaseSuccessEmbed(client, message, self);
						successEmbed.setDescription(
							`Successfully muted <@${user.id}> for \`${reason}\``
						);
						return message.channel.send(successEmbed).then(async (msg) => {
							msg.delete({ timeout: 10000 });
						});
					});
				} catch (e) {
					console.log(e);

					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription(
						`\`\`\`Error details: An unexpected error has occurred\`\`\``
					);
					return message.channel.send(errEmbed);
				}

				const result = await this.connection.query(
					`SELECT caseNumber FROM GuildModerations WHERE guildId = '${message.guild.id}'`
				);
				const caseNumber = await result[0];
				const mappedCaseNumber = caseNumber.map((r) => r.caseNumber);
				const updatedCaseNumber = mappedCaseNumber.length + 1;

				const modlog = await fetchModlog(this.connection, message.guild.id);

				const publicmodlog = await fetchPublicModlog(
					this.connection,
					message.guild.id
				);

				const modlogEmbed = BaseEmbed(client, message, self)
					.setTitle(`New moderation:`)
					.addField(`Action:`, `Mute`)
					.addField(`Case`, `\`${updatedCaseNumber}\``)
					.addField("User", `<@${user.user.id}>`)
					.addField("Moderator", `<@${message.author.id}>`)
					.addField("Reason", `\`${reason}\``)
					.addField("Date", `\`${message.createdAt.toLocaleString()}\``);

				const msg = await client.channels.cache.get(modlog).send(modlogEmbed);
				client.channels.cache.get(publicmodlog).send(modlogEmbed);

				this.connection.query(
					`INSERT INTO GuildModerations (guildId, moderation, reason, caseNumber, moderatorId, messageId) VALUES ('${message.guild.id}', 'mute', '${reason}', '${updatedCaseNumber}', '${message.author.id}', '${msg.id}') `
				);
			}
		} else {
			let muterole;

			const result = await this.connection.query(
				`SELECT muteRoleId FROM serverroles WHERE guildId = '${message.guild.id}'`
			);
			muterole = await result[0][0].muteRoleId;

			if (muterole === null) {
				return;
			} else if (muterole === "null") {
				return;
			} else {
				const dmEmbed = BaseEmbed(client, message, self)
					.setTitle(`New moderation`)
					.setDescription(
						`You have been muted in \`${message.guild.name}\` for \`${time}\`. Reason \`${reason}\``
					);

				try {
					user.send(dmEmbed);
				} catch (e) {
					console.log(e);

					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription(
						`\`\`\`Error details: An error occurred while trying to DM this user\`\`\``
					);
					return message.channel.send(errEmbed);
				}

				const result = await this.connection.query(
					`SELECT caseNumber FROM GuildModerations WHERE guildId = '${message.guild.id}'`
				);
				const caseNumber = await result[0];
				const mappedCaseNumber = caseNumber.map((r) => r.caseNumber);
				const updatedCaseNumber = mappedCaseNumber.length + 1;

				const modlog = await fetchModlog(this.connection, message.guild.id);

				const publicmodlog = await fetchPublicModlog(
					this.connection,
					message.guild.id
				);

				const modlogEmbed = BaseEmbed(client, message, self)
					.setTitle(`New moderation:`)
					.addField(`Action:`, `Tempmute`)
					.addField(`Case`, `\`${updatedCaseNumber}\``)
					.addField("User", `<@${user.user.id}>`)
					.addField("Moderator", `<@${message.author.id}>`)
					.addField("Time", `\`${time}\``)
					.addField("Reason", `\`${reason}\``)
					.addField("Date", `\`${message.createdAt.toLocaleString()}\``);

				if (user.roles.cache.has(muterole)) {
					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						`Error details: \`User is already muted!\``
					);
					return message.channel.send(errorEmbed);
				}
				message.guild.member(user).roles.add(muterole);

				const msg = await client.channels.cache.get(modlog).send(modlogEmbed);
				client.channels.cache.get(publicmodlog).send(modlogEmbed);

				this.connection.query(
					`INSERT INTO GuildModerations (guildId, moderation, reason, caseNumber, moderatorId, messageId) VALUES ('${message.guild.id}', 'mute', '${reason}', '${updatedCaseNumber}', '${message.author.id}', '${msg.id}') `
				);

				const succcessEmbed = await BaseSuccessEmbed(client, message, self);
				successEmbed.setDescription(
					`<@${user.id}> has been muted for \`${time}\`. Reason \`${reason}\``
				);
				message.channel.send(succcessEmbed).then(async (msg) => {
					msg.delete({ timeout: 10000 });
				});

				setTimeout(async function () {
					const unmute = BaseEmbed(client, message, self)
						.setTitle(`New moderation`)
						.addField(`Action:`, `\`Auto-unmute (Tempmute)\``)
						.addField(`Case`, `\`${updatedCaseNumber}\``)
						.addField("User", `<@${user.user.id}>`)
						.addField("Moderator", `<@${message.author.id}>`)
						.addField("Time", `\`${time}\``)
						.addField("Reason", `\`${reason}\``)
						.addField("Date", `\`${message.createdAt.toLocaleString()}\``);

					client.channels.cache.get(modlog).send(unmute);
					client.channels.cache.get(publicmodlog).send(unmute);

					if (!user.roles.cache.has(muterole)) {
						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription(
							`\`\`\`Error details: User is already unmuted!\`\`\``
						);
						return message.channel.send(errorEmbed);
					}

					const successEmbed = await BaseSuccessEmbed(client, message, self);
					successEmbed.setDescription("```Times up! Your mute is over!```");
					try {
						user.send(successEmbed);
					} catch (e) {
						console.log(e);
					}
					try {
						message.guild.member(user).roles.remove(muterole);
					} catch (e) {
						const errEmbed = await BaseErrorEmbed(client, message, self);
						errEmbed.setDescription(
							"```Error details: This user no longer has this role```"
						);
						return message.channel.send(errEmbed);
					}
				}, ms(time));
			}
		}
	}
};
