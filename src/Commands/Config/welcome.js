const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseSuccessEmbed,
	BaseEmbed,
} = require("../../utils/structures/functions");

module.exports = class WelcomeCommand extends BaseCommand {
	constructor() {
		super(
			"welcome",
			"config",
			[],
			"<enable | disable>",
			"Configure the welcome system for the guild ",
			"",
			[],
			[],
			[],
			true,
			10000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;

		if (!args[0]) {
			const res = await this.connection.query(
				`SELECT isEnabled FROM welcomesystem WHERE guildId = '${message.guild.id}'`
			);

			const enabled = await res[0][0].isEnabled;

			const ress = await this.connection.query(
				`SELECT media FROM welcomesystem WHERE guildId = '${message.guild.id}'`
			);
			const media = await ress[0][0].media;
			const result = await this.connection.query(
				`SELECT welcomeMessage FROM welcomesystem WHERE guildId = '${message.guild.id}'`
			);
			const wmessage = result[0][0].welcomeMessage;
			const response = await this.connection.query(
				`SELECT welcomeChannelId FROM welcomesystem WHERE guildId = '${message.guild.id}'`
			);

			const channel = await response[0][0].welcomeChannelId;

			const embed = BaseEmbed(client, message, this)
				.setTitle(`Welcome notification settings`)
				.setDescription(`Current settings for ${message.guild.name}`)
				.addField("Enabled", `\`${enabled === 1 ? "Enabled" : "Disabled"}\``)
				.addField("Media", `\`${media == null ? "None" : media}\``)
				.addField(
					"Message",
					`\`${wmessage == null ? "None" : `"${wmessage}"`}\``
				)
				.addField("Channel", `${channel == null ? "`None`" : `<#${channel}>`}`);

			return message.channel.send(embed);
		} else {
			if (args[0].toLowerCase(0).includes("enable")) {
				const res = await this.connection.query(
					`SELECT isEnabled FROM welcomesystem WHERE guildId = '${message.guild.id}'`
				);
				const enabled = await res[0][0].isEnabled;
				if (enabled === 1 || enabled === "1") {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						`\`\`\`Error details: This is already enabled.\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}

				let timedOut = false;

				const isFromAuthor = (m) => m.author.id == message.author.id;

				const options = {
					max: 1,
					time: 60000,
				};

				const tEmbed = BaseEmbed(client, message, this)
					.setTitle(`Welcome notification setup`)
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
						.setTitle(`Welcome notification setup`)
						.setDescription(`Please mention the welcome messages`)
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
								`UPDATE welcomesystem  SET isEnabled = true, media = "${m}", welcomeMessage = '${lmessage.replace(
									"'",
									"\\'"
								)}', welcomeChannelId = '${channel.id}' WHERE guildId = '${
									message.guild.id
								}'`
							);

							const embed = await BaseSuccessEmbed(client, message, self);
							embed.setDescription(
								`Successfully enabled welcome system! Media: \`${m}\` Welcome message: \`${lmessage}\` Channel ID: <#${channel.id}>`
							);
							return message.channel.send(embed);
						} else timeout = true;
					} else timedOut = true;
				} else timedOut = true;

				if (timedOut) {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(`Error details: \`Command timed out!\``);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}
			} else if (args[0].toLowerCase().includes("disable")) {
				const res = await this.connection.query(
					`SELECT isEnabled FROM welcomesystem WHERE guildId = '${message.guild.id}'`
				);
				const enabled = await res[0][0].isEnabled;
				if (enabled === 0 || enabled === "0") {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						`\`\`\`Error details: This is already enabled.\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}

				this.connection.query(
					`UPDATE welcomesystem SET isEnabled = false, media = null, welcomeMessage = null, welcomeChannelId = null WHERE guildId = '${message.guild.id}'`
				);

				const embed = await BaseSuccessEmbed(client, message, this);
				embed.setDescription(`Successfully disabled welcome system!`);
				return message.channel.send(embed);
			} else if (args[0].toLowerCase().includes("update")) {
				const res = await this.connection.query(
					`SELECT isEnabled FROM welcomesystem WHERE guildId = '${message.guild.id}'`
				);
				const enabled = await res[0][0].isEnabled;
				if (enabled === 0 || enabled === "0") {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						`\`\`\`Error details: Use !welcome enable.\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}

				const isFromAuthor = (m) => m.author.id == message.author.id;

				const options = {
					max: 1,
					time: 60000,
				};

				const tEmbed = BaseEmbed(client, message, this)
					.setTitle(`Welcome notification setup`)
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
						embed.setDescription(`Successfully cancelled section!`);
						return message.channel.send(embed);
					}

					if (
						toUpdate === "media" ||
						toUpdate.toLowerCase().includes("media")
					) {
						const dEmbed = BaseEmbed(client, message, this)
							.setTitle(`Welcome notification setup`)
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
								embed.setDescription(`Successfully cancelled section!`);
								return message.channel.send(embed);
							}

							if (media.toLowerCase().includes("text")) {
								this.connection.query(
									`UPDATE welcomesystem SET media = 'text' WHERE guildId = '${message.guild.id}'`
								);

								const embed = await BaseSuccessEmbed(client, message, self);
								embed.setDescription(`Successfully set media to \`text\``);
								return message.channel.send(embed);
							} else if (media.toLowerCase().includes("image")) {
								this.connection.query(
									`UPDATE welcomesystem SET media = 'image' WHERE guildId = '${message.guild.id}'`
								);

								const embed = await BaseSuccessEmbed(client, message, self);
								embed.setDescription(`Successfully set media to \`image\``);
								return message.channel.send(embed);
							} else {
								const errorEmbed = await BaseErrorEmbed(client, message, self);
								errorEmbed.setDescription(
									`\`\`\`Error details: Has to be text or image`
								);
								const msg = await message.channel.send(errorEmbed);
								return msg.delete({ timeout: 10000 });
							}
						}
					} else if (
						toUpdate === "message" ||
						toUpdate.toLowerCase().includes("message")
					) {
						const dEmbed = BaseEmbed(client, message, this)
							.setTitle(`Welcome notification setup`)
							.setDescription(`Please mention the welcome messages`);

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

							this.connection.query(
								`UPDATE welcomesystem SET welcomeMessage = '${lmessage.replace(
									"'",
									"\\'"
								)}' WHERE guildId = '${message.guild.id}'`
							);

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
							.setTitle(`Welcome notification setup`)
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
								const embed = await BaseSuccessEmbed(client, message, self);
								embed.setDescription(`Successfully cancelled section!`);
								return message.channel.send(embed);
							}

							this.connection.query(
								`UPDATE welcomesystem SET welcomeChannelId = '${channel.id}' WHERE guildId = '${message.guild.id}'`
							);

							const embed = await BaseSuccessEmbed(client, message, self);
							embed.setDescription(
								`Successfully updated welcome channel to <#${channel.id}>`
							);
							return message.channel.send(embed);
						}
					} else {
						const errorEmbed = await BaseErrorEmbed(client, message, self);
						errorEmbed.setDescription(
							`\`\`\`Error details: Invalid option\`\`\``
						);
						const msg = await message.channel.send(errorEmbed);
						return msg.delete({ timeout: 10000 });
					}
				}
			}
		}
	}
};
