const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseSuccessEmbed,
	BaseEmbed,
} = require("../../utils/structures/functions");

module.exports = class LeaveSettingsCommand extends BaseCommand {
	constructor() {
		super(
			"goodbyes",
			"config",
			[],
			"<enable || disable || update>",
			"Configure the leave system for the guild",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_SERVER", "ADMINISTRATOR"],
			[
				"leave enable` - Enable the leave system for the guild",
				"leave disable` - Disable the leave system for the guild",
				"leave update` - Update certain settings for the guild",
			],
			["leave", "leave enable", "leave disable", "leave update"],
			true,
			10000,
			false,
			false,
			["MANAGE_SERVER", "ADMINISTRATOR"],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;

		if (!message.member.hasPermission(["MANAGE_SERVER" || "ADMINISTRATOR"]))
			if (!args[0]) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: Must be enable or disable\`\`\``
				);
				return message.channel.send(errorEmbed);
			} else {
				if (args[0].toLowerCase().includes("enable")) {
					const res = await this.connection.query(
						`SELECT isEnabled FROM leavesystem WHERE guildId = '${message.guild.id}'`
					);
					const enabled = await res[0][0].isEnabled;
					if (enabled === 1 || enabled === "1") {
						const errorEmbed = await BaseErrorEmbed(client, message, this);
						errorEmbed.setDescription(
							`\`\`\`Error details: This is already enabled.\`\`\``
						);
						return message.channel.send(errorEmbed);
					}

					let timedOut = false;

					const isFromAuthor = (m) => m.author.id == message.author.id;

					const options = {
						max: 1,
						time: 60000,
					};

					const tEmbed = BaseEmbed(client, message, this)
						.setTitle(`Leave notification setup`)
						.setDescription(`Please mention the media: \`image\` or \`text\``);
					await message.channel.send(tEmbed);

					const firstColl = await message.channel.awaitMessages(
						isFromAuthor,
						options
					);

					if (firstColl.size > 0) {
						const media = firstColl.first().content;

						if (media.toLowerCase() === "cancel") {
							const embed = await BaseSuccessEmbed(client, message, self);
							embed.setDescription(`Successfully cancelled section!`);
							return message.channel.send(embed);
						}

						let m;

						if (
							!media.toLowerCase().includes("image") ||
							!media.toLowerCase().includes("text")
						)
							if (media.toLowerCase().includes("image")) {
								m = "image";
							} else if (media.toLowerCase().includes("text")) {
								m = "text";
							}

						const dEmbed = BaseEmbed(client, message, this)
							.setTitle(`Leave notification setup`)
							.setDescription(`Please mention the leave messages`)
							.addField(
								"Variables:",
								`\`{user}\` returns user username/mention | \`{server}\` returns server name`
							);

						await message.channel.send(dEmbed);
						const secondColl = await message.channel.awaitMessages(
							isFromAuthor,
							options
						);

						if (secondColl.size > 0) {
							const lmessage = secondColl.first().content;

							if (lmessage.toLowerCase() === "cancel") {
								const embed = await BaseSuccessEmbed(client, message, self);
								embed.setDescription(`Successfully cancelled section!`);
								return message.channel.send(embed);
							}

							const cEmbed = BaseEmbed(client, message, this)
								.setTitle(`Announce command setup`)
								.setDescription(`Please mention a channel.`);
							await message.channel.send(cEmbed);
							const thridColl = await message.channel.awaitMessages(
								isFromAuthor,
								options
							);

							if (thridColl.size > 0) {
								const result = thridColl.first().content;
								const msg = thridColl.first();
								let channel =
									msg.guild.channels.cache.find((c) => c.name === result) ||
									msg.guild.channels.cache.find((c) => c.id === result) ||
									msg.mentions.channels.first();

								if (result.toLowerCase() === "cancel") {
									const embed = await BaseSuccessEmbed(client, message, self);
									embed.setDescription(`Successfully cancelled section!`);
									return message.channel.send(embed);
								}

								this.connection.query(
									`UPDATE leavesystem  SET isEnabled = true, media = '${m}', leaveMessage = '${lmessage}', leaveChannelId = '${channel.id}' WHERE guildId = '${message.guild.id}'`
								);

								const embed = await BaseSuccessEmbed(client, message, self);
								embed.setDescription(
									`Successfully enabled leave system! Media: \`${m}\` Leave message: \`${lmessage}\` Channel ID: <#${channel.id}>`
								);
								return message.channel.send(embed);
							} else timeout = true;
						} else timedOut = true;
					} else timedOut = true;

					if (timedOut) {
						const errorEmbed = await BaseErrorEmbed(client, message, this);
						errorEmbed.setDescription(`Error details: \`Command timed out!\``);
						return message.channel.send(errorEmbed);
					}
				} else if (args[0].toLowerCase().includes("disable")) {
					const res = await this.connection.query(
						`SELECT isEnabled FROM leavesystem WHERE guildId = '${message.guild.id}'`
					);
					const enabled = await res[0][0].isEnabled;
					if (enabled === 0 || enabled === "0") {
						const errorEmbed = await BaseErrorEmbed(client, message, this);
						errorEmbed.setDescription(
							`\`\`\`Error details: This is already enabled.\`\`\``
						);
						return message.channel.send(errorEmbed);
					}
					this.connection.query(
						`UPDATE leavesystem SET isEnabled = false, media = null, leaveMessage = null, leaveChannelId = null WHERE guildId = '${message.guild.id}'`
					);

					const embed = await BaseSuccessEmbed(client, message, this);
					embed.setDescription(`Successfully disabled leave system!`);
					return message.channel.send(embed);
				} else if (args[0].toLowerCase().includes("update")) {
					const res = await this.connection.query(
						`SELECT isEnabled FROM leavesystem WHERE guildId = '${message.guild.id}'`
					);
					const enabled = await res[0][0].isEnabled;
					if (enabled === 0 || enabled === "0") {
						const errorEmbed = await BaseErrorEmbed(client, message, this);
						errorEmbed.setDescription(
							`\`\`\`Error details: Use !leaves enable.\`\`\``
						);
						return message.channel.send(errorEmbed);
					}

					const isFromAuthor = (m) => m.author.id == message.author.id;

					const options = {
						max: 1,
						time: 60000,
					};

					const tEmbed = BaseEmbed(client, message, this)
						.setTitle(`Leave notification setup`)
						.setDescription(
							`What would you like to update? [\`message\`|\`media\`|\`channel\`]`
						);
					await message.channel.send(tEmbed);

					const firstColl = await message.channel.awaitMessages(
						isFromAuthor,
						options
					);

					if (firstColl.size > 0) {
						const toUpdate = firstColl.first().content;

						if (toUpdate.toLowerCase() === "cancel") {
							const embed = await BaseSuccessEmbed(client, message, self);
							embed.setDescription(`Sucessfully cancelled section!`);
							return message.channel.send(embed);
						}

						if (
							toUpdate === "media" ||
							toUpdate.toLowerCase().includes("media")
						) {
							const dEmbed = BaseEmbed(client, message, this)
								.setTitle(`Leave notification setup`)
								.setDescription(
									`What would you like to set the media to? \`text\` or \`image\``
								);
							await message.channel.send(dEmbed);
							const secondColl = await message.channel.awaitMessages(
								isFromAuthor,
								options
							);

							if (secondColl.size > 0) {
								const media = secondColl.first().content;

								if (media.toLowerCase() === "cancel") {
									const embed = await BaseSuccessEmbed(client, message, self);
									embed.setDescription(`Sucessfully cancelled section!`);
									return message.channel.send(embed);
								}

								if (media.toLowerCase().includes("text")) {
									this.connection.query(
										`UPDATE leavesystem SET media = 'text' WHERE guildId = '${message.guild.id}'`
									);

									const embed = await BaseSuccessEmbed(client, message, self);
									embed.setDescription(`Successfully set media to \`text\``);
									return message.channel.send(embed);
								} else if (media.toLowerCase().includes("image")) {
									this.connection.query(
										`UPDATE leavesystem SET media = 'image' WHERE guildId = '${message.guild.id}'`
									);

									const embed = await BaseSuccessEmbed(client, message, self);
									embed.setDescription(`Successfully set media to \`image\``);
									return message.channel.send(embed);
								} else {
									const errorEmbed = await BaseErrorEmbed(
										client,
										message,
										self
									);
									errorEmbed.setDescription(
										`\`\`\`Error details: Has to be text or image`
									);
									return message.channel.send(errorEmbed);
								}
							}
						} else if (
							toUpdate === "message" ||
							toUpdate.toLowerCase().includes("message")
						) {
							const dEmbed = BaseEmbed(client, message, this)
								.setTitle(`Leave notification setup`)
								.setDescription(`Please mention the leave messages`);

							await message.channel.send(dEmbed);
							const secondColl = await message.channel.awaitMessages(
								isFromAuthor,
								options
							);

							if (secondColl.size > 0) {
								const lmessage = secondColl.first().content;

								this.connection.query(
									`UPDATE leavesystem SET leaveMessage = '${lmessage}' WHERE guildId = '${message.guild.id}'`
								);

								if (lmessage.toLowerCase() === "cancel") {
									const embed = await BaseSuccessEmbed(client, message, self);
									embed.setDescription(`Successfully cancelled the selection!`);
									return message.channel.send(embed);
								}

								const embed = await BaseSuccessEmbed(client, message, self);
								embed.setDescription(
									`Successfully updated message to ${lmessage}`
								);
								return message.channel.send(embed);
							}
						} else if (
							toUpdate === "channel" ||
							toUpdate.toLowerCase().includes("channel")
						) {
							const dEmbed = BaseEmbed(client, message, this)
								.setTitle(`Leave notification setup`)
								.setDescription(`Please mention a channel!`);

							await message.channel.send(dEmbed);
							const secondColl = await message.channel.awaitMessages(
								isFromAuthor,
								options
							);

							if (secondColl.size > 0) {
								const result = secondColl.first().content;
								const msg = secondColl.first();
								let channel =
									msg.guild.channels.cache.find((c) => c.name === result) ||
									msg.guild.channels.cache.find((c) => c.id === result) ||
									msg.mentions.channels.first();

								if (result.toLowerCase() === "cancel") {
									const errorEmbed = await BaseSuccessEmbed(
										client,
										message,
										self
									);
									errorEmbed.setDescription(`Successfully canelled selection!`);
									return message.channel.send(errorEmbed);
								}

								this.connection.query(
									`UPDATE leavesystem SET leaveChannelId = '${channel.id}' WHERE guildId = '${message.guild.id}'`
								);

								const embed = await BaseSuccessEmbed(client, message, self);
								embed.setDescription(
									`Successfully updated leave channel to <#${channel.id}>`
								);
								return message.channel.send(embed);
							}
						} else {
							const errorEmbed = await BaseErrorEmbed(client, message, self);
							errorEmbed.setDescription(
								`\`\`\`Error details: Invalid option\`\`\``
							);
							return message.channel.send(errorEmbed);
						}
					}
				}
			}
	}
};
