const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseSuccessEmbed,
	BaseErrorEmbed,
	getLang,
	getString,
	fetchModlog,
	fetchPublicModlog,
	getCaseNumber,
	insertModeration,
} = require("../../utils/structures/functions");

module.exports = class PurgeCommand extends BaseCommand {
	constructor() {
		super(
			"clear",
			"moderation",
			["purge"],
			"!purge <#>",
			"Purges the mentioned amount of messages (have to be under 2 weeks old)",
			"",
			["MANAGE_MESSAGES", "ADMINISTRATOR", "SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["purge 20", "purge 20 @Tech!"],
			true,
			1000,
			false,
			false,
			"",
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
		const lang = await getLang(message.guild.id, this.connection);

		if (!message.member.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(`Error details: \`Missing permissions\``);
			return message.channel.send(errorEmbed);
		}

		if (!message.guild.me.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(`Error details: \`I am missing permissions\``);
			return message.channel.send(errorEmbed);
		}

		const user = message.mentions.users.first();
		let mention;

		if (user) {
			mention = user.id;
		}

		let toClear = args[0];

		if (!toClear) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: Missing a required argument\`\`\``
			);
			return message.channel.send(errorEmbed);
		}

		if (isNaN(toClear)) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const updatednumber = +args[0] + +1;

			try {
				if (user) {
					const reason = args.slice(2).join(" ");
					if (!reason) reason = "No reason given";

					message.channel.messages
						.fetch({ limit: 100 })
						.then(async (messages) => {
							const botmessages = [];
							messages
								.filter((m) => m.author.id === user.id)
								.forEach((msg) => botmessages.push(msg));

							try {
								const test = botmessages.slice(0, updatednumber);
								message.channel.bulkDelete(test).then(async () => {
									const successEmbed = await BaseSuccessEmbed(
										client,
										message,
										this
									);
									successEmbed.setDescription(
										`Success! \`${args[0]}\` messages deleted`
									);

									const mesg = await message.channel.send(successEmbed);
									mesg.delete({ timeout: 5000 });
									const logEmbed = BaseEmbed(client, message, self)
										.setTitle(`Action logs`)
										.setDescription("New action: `Clear`")
										.addField("Moderator", `<@${message.author.id}>`)
										.addField("Channel", `<#${message.channel.id}>`)
										.addField("Reason", `\`No reason given\``)
										.addField("# of messages", `\`${args[0]}\``)
										.addField("Date", `${message.createdAt.toLocaleString()}`);

									const caseNumber = await getCaseNumber(
										message.guild.id,
										this.connection
									);

									const modlog = await fetchModlog(
										this.connection,
										message.guild.id
									);
									const publicmodlog = await fetchPublicModlog(
										this.connection,
										message.guild.id
									);

									let mid;
									if (modlog == null) {
										mid = null;
									} else {
										let m = await client.channels.cache
											.get(modlog)
											.send(logEmbed);
										mid = m.id;
									}
									let pid;
									if (publicmodlog == null) {
										pid = null;
									} else {
										let p = await client.channels.cache
											.get(publicmodlog)
											.send(logEmbed);
										pid = p.id;
									}

									await insertModeration(
										message.guild.id,
										"clear",
										caseNumber,
										message.author.id,
										this.connection,
										{
											user: user.id,
											reason: reason,
											modlog: mid,
											publicmodlog: pid,
											modlogId: modlog,
											publicmodlogId: publicmodlog,
											modDate: Date.now(),
											updatedAt: Date.now(),
											updatedBy: message.author.id,
										}
									);
								});
							} catch (err) {
								console.log(err);

								const errEmbed = await BaseErrorEmbed(client, message, self);
								errEmbed.setDescription(
									`\`\`\`Error details: ${getString(
										lang,
										"unexpected_error"
									)}\`\`\``
								);
								return message.channel.send(errEmbed);
							}
						});
				} else {
					try {
						const reason = args.slice(1).join(" ");
						if (!reason) reason = "No reason given";

						message.channel.bulkDelete(toClear).then(async () => {
							const successEmbed = await BaseSuccessEmbed(
								client,
								message,
								self
							);
							successEmbed.setDescription(
								`Success! \`${args[0]}\` messages deleted`
							);

							const msssg = await message.channel.send(successEmbed);

							msssg.delete({ timeout: 5000 });

							const logEmbed = BaseEmbed(client, message, self)
								.setTitle(`Action logs`)
								.setDescription("New action: `Clear`")
								.addField("Moderator", `<@${message.author.id}>`)
								.addField("Channel", `<#${message.channel.id}>`)
								.addField("# of messages", `\`${args[0]}\``)
								.addField("Date", `${message.createdAt.toLocaleString()}`);

							const modlog = await fetchModlog(
								this.connection,
								message.guild.id
							);
							const publicmodlog = await fetchPublicModlog(
								this.connection,
								message.guild.id
							);

							const caseNumber = await getCaseNumber(
								message.guild.id,
								this.connection
							);

							let mid;
							if (modlog == null) {
								mid = null;
							} else {
								let m = await client.channels.cache.get(modlog).send(logEmbed);
								mid = m.id;
							}
							let pid;
							if (modlog == null) {
								pid = null;
							} else {
								let p = await client.channels.cache
									.get(publicmodlog)
									.send(logEmbed);
								pid = p.id;
							}

							await insertModeration(
								message.guild.id,
								"clear",
								caseNumber,
								message.author.id,
								this.connection,
								{
									modlog: mid,
									reason: reason,
									publicmodlog: pid,
									modlogId: modlog,
									publicmodlogId: publicmodlog,
									modDate: Date.now(),
									updatedAt: Date.now(),
									updatedBy: message.author.mid,
								}
							);
						});
					} catch (e) {
						console.log(e);

						const errEmbed = await BaseErrorEmbed(client, message, self);
						errEmbed.setDescription(
							`\`\`\`Error details: ${getString(
								lang,
								"unexpected_error"
							)}\`\`\``
						);
						return message.channel.send(errEmbed);
					}
				}
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
				return message.channel.send(errorEmbed);
			}
		}
	}
};
