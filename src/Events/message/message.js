const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const guildCommandPrefixes = new Map();
const { MessageEmbed } = require("discord.js");
const {
	colour,
	getString,
	getLang,
	capitalize,
	fetchPrefix,
} = require("../../utils/structures/functions");
const { error_emoji } = require("../../../emojis.json");
const { Manager } = require("erela.js");

module.exports = class MessageEvent extends (
	BaseEvent
) {
	constructor() {
		super("message");
		this.connection = StateManager.connection;
	}

	async run(client, message) {
		if (message.author.bot) return;

		if (message.channel.type === "dm") {
			const prefix = "!";

			const usedPrefix = message.content.slice(0, prefix.length);

			if (prefix === usedPrefix) {
				const [cmdName, ...cmdArgs] = message.content
					.slice(prefix.length)
					.split(/\s+/);
				const command =
					client.commands.get(cmdName.toLowerCase()) ||
					client.commands.get(client.aliases.get(cmdName.toLowerCase()));
				if (command) {
					if (command.commandstatus === "wip") {
						const errorEmbed = new MessageEmbed()
							.setAuthor(
								client.user.username,
								client.user.displayAvatarURL({ dynamic: true })
							)
							.setTitle(`${error_emoji} | Oops, an error has occurred`)
							.setDescription(`\`\`\`Error details: Command is WIP\`\`\``)
							.setColor(colour())
							.setTimestamp()
							.setThumbnail(
								message.guild
									? message.guild.iconURL({ dynamic: true })
									: client.user.displayAvatarURL({ dynamic: true })
							)
							.setFooter(
								`WIP commands | ${client.user.username}`,
								client.user.displayAvatarURL({ dynamic: true })
							);
						return message.channel.send(errorEmbed);
					}
					if (
						command.owner === "true" &&
						message.author.id !== "398264990567628812"
					) {
						const errorEmbed = new MessageEmbed()
							.setAuthor(
								client.user.username,
								client.user.displayAvatarURL({ dynamic: true })
							)
							.setTitle(`${error_emoji} | Oops, an error has occurred!`)
							.setDescription(
								`\`\`\`Error details: Command is owner only\`\`\``
							)
							.setColor(colour())
							.setTimestamp()
							.setThumbnail(
								message.guild
									? message.guild.iconURL({ dynamic: true })
									: client.user.displayAvatarURL({ dynamic: true })
							)
							.setFooter(
								`Owner commands | ${client.user.username}`,
								client.user.displayAvatarURL({ dynamic: true })
							);
						return message.channel.send(errorEmbed);
					}
					if (command.nsfw === true || command.nsfw === "true") {
						const errorEmbed = new MessageEmbed()
							.setAuthor(
								client.user.username,
								client.user.displayAvatarURL({ dynamic: true })
							)
							.setTitle(`${error_emoji} | Oops, an error has occurred!`)
							.setDescription(
								`\`\`\`Error details: NSFW commands can only be used in servers\`\`\``
							)
							.setColor(colour())
							.setTimestamp()
							.setThumbnail(
								message.guild
									? message.guild.iconURL({ dynamic: true })
									: client.user.displayAvatarURL({ dynamic: true })
							)
							.setFooter(
								`NSFW commands | ${client.user.username}`,
								client.user.displayAvatarURL({ dynamic: true })
							);
						return message.channel.send(errorEmbed);
					}
					if (command.guildOnly === "true") {
						const errorEmbed = new MessageEmbed()
							.setAuthor(
								client.user.username,
								client.user.displayAvatarURL({ dynamic: true })
							)
							.setTitle(`${error_emoji} | Oops, an error has occurred!`)
							.setDescription(
								`\`\`\`Error details: Can't use server only commands in DMs\`\`\``
							)
							.setColor(colour())
							.setTimestamp()
							.setThumbnail(
								message.guild
									? message.guild.iconURL({ dynamic: true })
									: client.user.displayAvatarURL({ dynamic: true })
							)
							.setFooter(
								`DM commands | ${client.user.username}`,
								client.user.displayAvatarURL({ dynamic: true })
							);
						return message.channel.send(errorEmbed);
					}
					if (command.guildOnly == true) {
						const errorEmbed = new MessageEmbed()
							.setAuthor(
								client.user.username,
								client.user.displayAvatarURL({ dynamic: true })
							)
							.setTitle(`${error_emoji} | Oops, an error has occurred!`)
							.setDescription(
								`\`\`\`Error details: Can't use server only commands in DMs\`\`\``
							)
							.setColor(colour())
							.setTimestamp()
							.setThumbnail(
								message.guild
									? message.guild.iconURL({ dynamic: true })
									: client.user.displayAvatarURL({ dynamic: true })
							)
							.setFooter(
								`DM commands | ${client.user.username}`,
								client.user.displayAvatarURL({ dynamic: true })
							);
						return message.channel.send(errorEmbed);
					} else {
						const cooldown = client.cooldown.get(message.author.id);

						if (cooldown && cooldown.cmd === `${command.name}`) {
							if (Date.now() - cooldown.time < command.cooldown) {
								const wait = Date.now() - cooldown.time;
								const sec = Math.floor((wait / 1000) % 60).toString();
								const cooldownEmbed = new MessageEmbed()
									.setAuthor(
										client.user.username,
										client.user.displayAvatarURL({ dynamic: true })
									)
									.setTitle(`${error_emoji} | Oops, an error has occurred!`)
									.setDescription(
										`Error details: Slow down! Wait \`${sec}\` until you can use \`${command.name}\` again!`
									)
									.setColor(colour())
									.setTimestamp()
									.setThumbnail(
										message.guild
											? message.guild.iconURL({ dynamic: true })
											: client.user.displayAvatarURL({ dynamic: true })
									)
									.setFooter(
										`Cooldown | ${client.user.username}`,
										client.user.displayAvatarURL({ dynamic: true })
									);
								return message.channel.send(cooldownEmbed);
							} else {
								command.run(client, message, cmdArgs);
							}
						} else {
							command.run(client, message, cmdArgs);
						}
						client.cooldown.set(message.author.id, {
							cmd: `${command.name}`,
							time: Date.now(),
						});
						return;
					}
				} else {
					return;
				}
			}
		} else {
			const lang = await getLang(message.guild.id, this.connection);
			const prefix = await fetchPrefix(this.connection, message.guild.id);
			if (message.content.includes(`<@${client.user.id}> prefix`)) {
				const currentPrefixembed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle("Core prefix")
					.setDescription(
						`My current prefix is: \`${prefix}\`. If you would like to change it use \`${prefix}prefix <new prefix>\``
					)
					.setColor(colour())
					.setTimestamp()
					.setThumbnail(
						message.guild
							? message.guild.iconURL({ dynamic: true })
							: client.user.displayAvatarURL({ dynamic: true })
					)
					.setFooter(
						`Prefix | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return message.channel.send(currentPrefixembed);
			} else if (message.content.includes(`<@!${client.user.id}> prefix`)) {
				const currentPrefixembed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						client.user.displayAvatarURL({ dynamic: true })
					)
					.setTitle("Core prefix")
					.setDescription(
						`My current prefix is: \`${prefix}\`. If you would like to change it use \`${prefix}prefix <new prefix>\``
					)
					.setColor(colour())
					.setTimestamp()
					.setThumbnail(
						message.guild
							? message.guild.iconURL({ dynamic: true })
							: client.user.displayAvatarURL({ dynamic: true })
					)
					.setFooter(
						`Prefix | ${client.user.username}`,
						client.user.displayAvatarURL({ dynamic: true })
					);
				return message.channel.send(currentPrefixembed);
			}

			const usedPrefix = message.content.slice(0, prefix.length);

			if (prefix === usedPrefix) {
				const [cmdName, ...cmdArgs] = message.content
					.slice(prefix.length)
					.split(/\s+/);
				const command =
					client.commands.get(cmdName.toLowerCase()) ||
					client.commands.get(client.aliases.get(cmdName.toLowerCase()));
				if (command) {
					if (!message.guild.me.hasPermission(["SEND_MESSAGES"])) {
						throw new Error(
							`Cannot send messages in ${message.guild.id} | ${message.guild.ownerID}`
						);
					}
					if (!message.guild.me.hasPermission(["EMBED_LINKS"])) {
						return message.channel.send(
							`I require the \`EMBED_LINKS\` permission otherwise I cannot fulfill the commands.`
						);
					}

					if (command.nsfw === true && !message.channel.nsfw) {
						const errorEmbed = new MessageEmbed()
							.setAuthor(
								client.user.username,
								client.user.displayAvatarURL({ dynamic: true })
							)
							.setTitle(`${error_emoji} | ${getString(lang, "error_message")}`)
							.setDescription(
								`\`\`\`Error details: This channel is not an NSFW channel.\`\`\``
							)
							.setColor(colour())
							.setTimestamp()
							.setThumbnail(
								message.guild
									? message.guild.iconURL({ dynamic: true })
									: client.user.displayAvatarURL({ dynamic: true })
							)
							.setFooter(
								`NSFW commands | ${client.user.username}`,
								client.user.displayAvatarURL({ dynamic: true })
							);
						return message.channel.send(errorEmbed);
					} else if (command.nsfw === "true" && !message.channel.nsfw) {
						const errorEmbed = new MessageEmbed()
							.setAuthor(
								client.user.username,
								client.user.displayAvatarURL({ dynamic: true })
							)
							.setTitle(`${error_emoji} | ${getString(lang, "error_message")}`)
							.setDescription(
								`\`\`\`Error details: This channel is not an NSFW channel.\`\`\``
							)
							.setColor(colour())
							.setTimestamp()
							.setThumbnail(
								message.guild
									? message.guild.iconURL({ dynamic: true })
									: client.user.displayAvatarURL({ dynamic: true })
							)
							.setFooter(
								`NSFW commands | ${client.user.username}`,
								client.user.displayAvatarURL({ dynamic: true })
							);
						return message.channel.send(errorEmbed);
					}

					if (
						command.owner === "true" &&
						message.author.id !== "398264990567628812"
					) {
						const errorEmbed = new MessageEmbed()
							.setAuthor(
								client.user.username,
								client.user.displayAvatarURL({ dynamic: true })
							)
							.setTitle(`${error_emoji} | ${getString(lang, "error_message")}`)
							.setDescription(
								`\`\`\`Error details: You are not the owner.\`\`\``
							)
							.setColor(colour())
							.setTimestamp()
							.setThumbnail(
								message.guild
									? message.guild.iconURL({ dynamic: true })
									: client.user.displayAvatarURL({ dynamic: true })
							)
							.setFooter(
								`Owner dcommands | ${client.user.username}`,
								client.user.displayAvatarURL({ dynamic: true })
							);
						return message.channel.send(errorEmbed);
					}

					if (command.commandstatus.toLowerCase() === "wip") {
						const errorEmbed = new MessageEmbed()
							.setAuthor(
								client.user.username,
								client.user.displayAvatarURL({ dynamic: true })
							)
							.setTitle(`${error_emoji} | ${getString(lang, "error_message")}`)
							.setDescription(`\`\`\`Error details: This command is WIP\`\`\``)
							.setColor(colour())
							.setTimestamp()
							.setThumbnail(
								message.guild
									? message.guild.iconURL({ dynamic: true })
									: client.user.displayAvatarURL({ dynamic: true })
							)
							.setFooter(
								`WIP command | ${client.user.username}`,
								client.user.displayAvatarURL({ dynamic: true })
							);
						return message.channel.send(errorEmbed);
					}

					if (
						command.commandstatus.toLowerCase() === "debug" &&
						message.author.id !== "398264990567628812"
					) {
						const errorEmbed = new MessageEmbed()
							.setAuthor(
								client.user.username,
								client.user.displayAvatarURL({ dynamic: true })
							)
							.setTitle(`${error_emoji} | ${getString(lang, "error_message")}`)
							.setDescription(
								`\`\`\`Error details: This command is currently being developed and tested\`\`\``
							)
							.setColor(colour())
							.setTimestamp()
							.setThumbnail(
								message.guild
									? message.guild.iconURL({ dynamic: true })
									: client.user.displayAvatarURL({ dynamic: true })
							)
							.setFooter(
								`Debug command | ${client.user.username}`,
								client.user.displayAvatarURL({ dynamic: true })
							);
						return message.channel.send(errorEmbed);
					}

					const cooldown = client.cooldown.get(message.author.id);

					if (cooldown && cooldown.cmd === `${command.name}`) {
						if (Date.now() - cooldown.time < command.cooldown) {
							const wait = Date.now() - cooldown.time;
							const sec = Math.floor((wait / 1000) % 60).toString();
							const test = `\`${sec}\` ${getString(lang, "seconds")}`;
							const cooldownEmbed = new MessageEmbed()
								.setAuthor(
									client.user.username,
									client.user.displayAvatarURL({ dynamic: true })
								)
								.setTitle(
									`${error_emoji} | ${getString(lang, "error_message")}`
								)
								.setDescription(
									`Error details: ${getString(
										lang,
										"cooldown_message",
										`${test}`,
										`\`${command.name}\``
									)}`
								)
								.setColor(colour())
								.setTimestamp()
								.setThumbnail(
									message.guild
										? message.guild.iconURL({ dynamic: true })
										: client.user.displayAvatarURL({ dynamic: true })
								)
								.setFooter(
									`Cooldown | ${client.user.username}`,
									client.user.displayAvatarURL({ dynamic: true })
								);
							return message.channel.send(cooldownEmbed);
						} else {
							this.connection
								.query(`SELECT * from botBlacklist`)
								.then((result) => {
									let blacklistedUsers = result[0];
									if (blacklistedUsers.length !== 0) {
										const blocked = blacklistedUsers.filter(
											(el) => el.userId === message.author.id
										)[0];

										if (blocked) {
											const errorEmbed = new MessageEmbed()
												.setAuthor(
													client.user.username,
													client.user.displayAvatarURL({ dynamic: true })
												)
												.setTitle(
													`${error_emoji} | ${getString(lang, "error_message")}`
												)
												.setDescription(
													`\`\`\`Error details: ${getString(
														lang,
														"user_blocked"
													)}.\`\`\``
												)
												.setColor(colour())
												.setTimestamp()
												.setThumbnail(
													message.guild
														? message.guild.iconURL({ dynamic: true })
														: client.user.displayAvatarURL({
																dynamic: true,
														  })
												)
												.setFooter(
													`Blocked user | ${client.user.username}`,
													client.user.displayAvatarURL({ dynamic: true })
												);
											return message.channel.send(errorEmbed);
										} else {
											command.run(client, message, cmdArgs);
										}
									} else {
										command.run(client, message, cmdArgs);
									}
								});
						}
					} else {
						this.connection
							.query(`SELECT * from botBlacklist`)
							.then((result) => {
								let blacklistedUsers = result[0];
								if (blacklistedUsers.length !== 0) {
									const blocked = blacklistedUsers.filter(
										(el) => el.userId === message.author.id
									)[0];

									if (blocked) {
										const errorEmbed = new MessageEmbed()
											.setAuthor(
												client.user.username,
												client.user.displayAvatarURL({ dynamic: true })
											)
											.setTitle(
												`${error_emoji} | ${getString(lang, "error_message")}`
											)
											.setDescription(
												`\`\`\`Error details: ${getString(
													lang,
													"user_blocked"
												)}.\`\`\``
											)
											.setColor(colour())
											.setTimestamp()
											.setThumbnail(
												message.guild
													? message.guild.iconURL({ dynamic: true })
													: client.user.displayAvatarURL({ dynamic: true })
											)
											.setFooter(
												`Blocked user | ${client.user.username}`,
												client.user.displayAvatarURL({ dynamic: true })
											);
										return message.channel.send(errorEmbed);
									} else {
										command.run(client, message, cmdArgs);
									}
								} else {
									command.run(client, message, cmdArgs);
								}
							});
					}
					client.cooldown.set(message.author.id, {
						cmd: `${command.name}`,
						time: Date.now(),
					});
				} else {
					return;
				}
			}
		}
	}
};

StateManager.on("prefixFetched", (guildId, prefix) => {
	guildCommandPrefixes.set(guildId, prefix);
});

StateManager.on("prefixUpdate", (guildId, prefix) => {
	guildCommandPrefixes.set(guildId, prefix);
});

StateManager.on("guildAdded", (guildId, prefix) => {
	guildCommandPrefixes.set(guildId, prefix);
});
