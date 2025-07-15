const BaseCommand = require("../../utils/structures/BaseCommand");
const { MessageEmbed } = require("discord.js");
const {
	BaseEmbed,
	BaseErrorEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");

module.exports = class HelpCommand extends BaseCommand {
	constructor() {
		super(
			"help",
			"bot",
			["halp"],
			"(command)",
			"Gives information about commands / shows the command list.",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["help", "help wolf"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		const self = this;
		/* 
PROPERTIES OF COMMAND
command.name | [string]
command.category | [string]
command.aliases  | [array] (stored in collection)
command.usage | [string]
command.description | [string]
command.accesableby | [string]
command.permissions | [array]
command.SubCommands | [string]
command.example | [string]
command.guildOnly [Boolean]
command.cooldown [Integer]
command.owner [Boolean]
command.nsfw [Boolean]
command.userPermissions [array]
command.commandStatus [string]
*/

		const cmd = args[0];

		if (!cmd) {
			const commands = {};
			client.commands.forEach((el) => {
				if (commands[el.category]) {
					commands[el.category].push(el.name);
				} else {
					commands[el.category] = [el.name];
				}
			});

			const categories = {
				titles: {
					aww: `Aww [${commands["aww"].length}]`,
					bot: `Bot [${commands["bot"].length}]`,
					canvas: `Canvas [${commands["canvas"].length}]`,
					config: `Config [${commands["config"].length}]`,
					economy: `Economy [${commands["economy"].length}]`,
					facts: `Facts [${commands["facts"].length}]`,
					fun: `Fun [${commands["fun"].length}]`,
					levels: `Levels [${commands["levels"].length}]`,
					logging: `Logging [${commands["logging"].length}]`,
					manager: `Manager [${commands["manager"].length}]`,
					memes: `Memes [${commands["memes"].length}]`,
					miscellaneous: `Miscellaneous [${commands["miscellaneous"].length}]`,
					moderation: `Moderation [${commands["moderation"].length}]`,
					music: `Moderation [${commands["music"].length}]`,
					owner: `Owner [${commands["owner"].length}]`,
					reaction_images: `Reaction images [${commands["reaction images"].length}]`,
					server_utilities: `Server utilities [${commands["server utilities"].length}]`,
				},
				command: {
					aww: commands["aww"].map((c) => `\`${c}\``).join(", "),
					bot: commands["bot"].map((c) => `\`${c}\``).join(", "),
					canvas: commands["canvas"].map((c) => `\`${c}\``).join(", "),
					config: commands["config"].map((c) => `\`${c}\``).join(", "),
					economy: commands["economy"].map((c) => `\`${c}\``).join(", "),
					facts: commands["facts"].map((c) => `\`${c}\``).join(", "),
					fun: commands["fun"].map((c) => `\`${c}\``).join(", "),
					levels: commands["levels"].map((c) => `\`${c}\``).join(", "),
					logging: commands["logging"].map((c) => `\`${c}\``).join(", "),
					manager: commands["manager"].map((c) => `\`${c}\``).join(", "),
					memes: commands["memes"].map((c) => `\`${c}\``).join(", "),
					miscellaneous: commands["miscellaneous"]
						.map((c) => `\`${c}\``)
						.join(", "),
					moderation: commands["moderation"].map((c) => `\`${c}\``).join(", "),
					music: commands["music"].map((c) => `\`${c}\``).join(", "),
					owner: commands["owner"].map((c) => `\`${c}\``).join(", "),
					reaction_images: commands["reaction images"]
						.map((c) => `\`${c}\``)
						.join(", "),
					server_utilities: commands["server utilities"]
						.map((c) => `\`${c}\``)
						.join(", "),
				},
			};

			if (message.guild) {
				const prefix = await this.Settings.FetchPrefix(message.guild.id);
				const lang = await this.Translator.getLang(message.guild.id);

				const awwEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(`${categories.titles.aww}`, `${categories.command.aww}`);
				const botEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(`${categories.titles.bot}`, `${categories.command.bot}`);
				const cEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.addField(
						`${categories.titles.canvas}`,
						`${categories.command.canvas}`
					);
				const coEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.config}`,
						`${categories.command.config}`
					);

				const eEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.economy}`,
						`${categories.command.economy}`
					);
				const fEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.facts}`,
						`${categories.command.facts}`
					);
				const fuEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(`${categories.titles.fun}`, `${categories.command.fun}`);

				const levelEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.levels}`,
						`${categories.command.levels}`
					);
				const logEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.logging}`,
						`${categories.command.logging}`
					);
				const mEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.manager}`,
						`${categories.command.manager}`
					);
				const meEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.memes}`,
						`${categories.command.memes}`
					);
				const miEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.miscellaneous}`,
						`${categories.command.miscellaneous}`
					);
				const moEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.moderation}`,
						`${categories.command.moderation}`
					);
				const music = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.music}`,
						`${categories.command.music}`
					);
				const oEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.owner}`,
						`${categories.command.owner}`
					);
				const rEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.reaction_images}`,
						`${categories.command.reaction_images}`
					);
				const suEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(
						`\`<>\` ${this.Translator.getString(
							lang,
							"is_required"
						)} \`()\` ${this.Translator.getString(
							lang,
							"is_optional"
						)} | Prefix: \`${prefix}\``
					)
					.setColor(this.Colour.set())
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					.addField(
						`${categories.titles.server_utilities}`,
						`${categories.command.server_utilities}`
					);

				return this.Utils.paginate(
					message,
					awwEmbed,
					botEmbed,
					cEmbed,
					coEmbed,
					eEmbed,
					fEmbed,
					fuEmbed,
					levelEmbed,
					logEmbed,
					mEmbed,
					meEmbed,
					miEmbed,
					moEmbed,
					music,
					oEmbed,
					rEmbed,
					suEmbed
				);
			} else {
				const awwEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(`${categories.titles.aww}`, `${categories.command.aww}`);
				const botEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(`${categories.titles.bot}`, `${categories.command.bot}`);
				const cEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.canvas}`,
						`${categories.command.canvas}`
					);
				const coEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.config}`,
						`${categories.command.config}`
					);
				const eEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.economy}`,
						`${categories.command.economy}`
					);
				const fEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.facts}`,
						`${categories.command.facts}`
					);
				const fuEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(`${categories.titles.fun}`, `${categories.command.fun}`);
				const levelEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.levels}`,
						`${categories.command.levels}`
					);
				const logEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.logging}`,
						`${categories.command.logging}`
					);
				const mEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.manager}`,
						`${categories.command.manager}`
					);
				const meEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.memes}`,
						`${categories.command.memes}`
					);
				const miEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.miscellaneous}`,
						`${categories.command.miscellaneous}`
					);
				const moEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.moderation}`,
						`${categories.command.moderation}`
					);
				const oEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.owner}`,
						`${categories.command.owner}`
					);
				const rEmbed = BaseEmbed(client, message, self)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.reaction_images}`,
						`${categories.command.reaction_images}`
					);
				const suEmbed = new MessageEmbed()
					.setAuthor(
						client.user.username,
						message.author.displayAvatarURL({ dynamic: true })
					)
					.setTitle(
						`Core help command | Command count: ${client.commands.size}`
					)
					.setDescription(`\`<>\` is required \`()\` is optional`)
					.addField(
						`${categories.titles.server_utilities}`,
						`${categories.command.server_utilities}`
					)
					.setTimestamp()
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setColor(this.Colour.set());

				return this.Utils.paginate(
					message,
					awwEmbed,
					botEmbed,
					cEmbed,
					coEmbed,
					eEmbed,
					fEmbed,
					fuEmbed,
					levelEmbed,
					logEmbed,
					mEmbed,
					meEmbed,
					miEmbed,
					moEmbed,
					oEmbed,
					rEmbed,
					suEmbed
				);
			}
		} else {
			const command = client.commands.get(cmd);

			if (!command) {
				const errorEmbed = await this.ErrorEmbed.Base({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: this,
					error_message: "The command you mentioned doesn't exist!",
				});
				return message.channel.send(errorEmbed);
			} else {
				if (message.channel.type === "dm") {
					return await this.HelpEmbed.Base({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						command: this,
						message: message,
					});
				} else {
					return await this.HelpEmbed.Base({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						command: this,
						message: message,
					});
				}
			}
		}
	}
};
