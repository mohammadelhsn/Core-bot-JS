const pagination = require("discord.js-pagination");
const StateManager = require("../StateManager");
const { MessageEmbed } = require("discord.js");
const language = require("../../../languages.json");
const descriptions = require("../../../descriptions.json");
const {
	red,
	green,
	purple_dark,
	purple_light,
	purple_medium,
	blue_dark,
	white,
	red_dark,
	red_light,
	orange,
	pink,
	aqua,
	gold,
	green_dark,
	green_light,
	cream,
	cyan,
} = require("../../../colours.json");
const { success_emoji, error_emoji, loading } = require("../../../emojis.json");
const colours = [
	red,
	green,
	purple_dark,
	purple_light,
	purple_medium,
	blue_dark,
	white,
	red_dark,
	red_light,
	orange,
	pink,
	aqua,
	gold,
	green_dark,
	green_light,
	cream,
	cyan,
];
const translateapi = require("@iamtraction/google-translate");
/**
 * @function translate
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @example
 * const translation = await translate("en", "hello")
 * @description Translate the given string
 * @async
 * @param {string} lang - Guild language
 * @param {string} text - Text to translate
 * @returns {string} translated string
 */
async function translate(lang, text) {
	if (!lang) throw new ReferenceError("Language is a required parameter");
	if (!text) throw new ReferenceError("Text is a required parameter");

	const translated = await translateapi(text, { from: "en", to: lang });
	return translated.text;
}

/**
 * @function getString
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @example
 * getString(lang, "provided_by")
 * @description Gets a translation from the languages.json file
 * @param {string} lang
 * @param {string} string
 * @param  {...any} vars
 * @returns {string} string with replaced values
 */

function getString(lang, string, ...vars) {
	let locale = language[lang][string];

	if (vars.length !== 0 || vars.length !== null) {
		vars.forEach((i) => {
			locale = locale.replace(/%VAR%/, i);
		});
	}
	return locale;
}
/**
 * @function getDescription
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Get the description of a command VIA the command name.
 * @param {string} lang The language to get the description for
 * @param {string} string Command name.
 * @returns {string} Returns translated string
 * @example
 * getDescription(lang, this.name)
 * getDescription(lang, command.name)
 */
function getDescription(lang, string) {
	let locale = descriptions[string][lang].description;
	return locale;
}

/**
 * @function getLang
 * @description Gets the language of the guild.
 * @example
 * const lang = await getLang(message.guild.id, this.connection)
 * @async
 * @param {string} id Guild ID
 * @param {object} connection Command / event connection
 * @returns {promise} ISO language code
 */

async function getLang(id, connection) {
	if (!id) throw new ReferenceError("Error is a required parameter");
	if (!connection)
		throw new ReferenceError("Connection is required to get the language.");

	const res = await connection.query(
		`SELECT lang FROM GuildConfigurable WHERE guildId = '${id}'`
	);
	const lang = await res[0][0].lang;
	return lang;
}

/**
 * @function capitalize
 * @description Applies a capital letter to the first letter in the string
 * @example
 * capitalize("hello world")
 * @param {string} string String to capitalize
 * @returns {string} with first letter capitalized
 */

function capitalize(string) {
	if (!string) throw new ReferenceError("No value given");
	if (typeof string !== "string")
		throw new ReferenceError("Given value is not a string");
	return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * @function paginate
 * @description
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @example
 * return paginate(message, embed1, embed2, embed3, embed4)
 * @param {object} message Discord.js message object
 * @param  {...any} args Embeds to paginate
 * @returns {object} paginated embeds
 */
function paginate(message, ...args) {
	if (!message)
		throw new ReferenceError(`Error: Message is a required parameter`);
	if (args.length <= 1 || args.length <= "1" || !args) {
		throw new ReferenceError("Error: Must include more than one embed");
	}

	return pagination(message, args);
}

/**
 * @function fetchPrefix
 * @description Fetches the prefix the guild
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @example
 * const prefix = await fetchPrefix(this.connection, message.guild.id)
 * @async
 * @param {object} connection - Command/event connection
 * @param {string} id - Guild ID
 * @returns {Promise} Guild ID prefix
 */

async function fetchPrefix(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError(`ID is a required argument`);

	const res = await connection.query(
		`SELECT cmdPrefix FROM GuildConfigurable WHERE guildId = '${id}'`
	);
	const prefix = await res[0][0].cmdPrefix;
	return prefix;
}
/**
 * @function fetchMemberLog
 * @description Fetches the memberlog for the guild.
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @example
 * const memberLog = await fetchMemberLog(this.connection, message.guild.id)
 * @async
 * @param {object} connection - Command / event connection
 * @param {string} id - Guild ID
 * @returns {Promise} MemberLog for guild
 */
async function fetchMemberLog(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT memberLogId FROM GuildLogging WHERE guildId = '${id}'`
	);
	const memberLog = await res[0][0].memberLogId;

	if (memberLog == null || memberLog == "null") {
		return null;
	} else {
		return memberLog;
	}
}
/**
 * @function fetchModlog
 * @description Fetches the modlog for the guild
 * @author Mohammad El-Hassan AKA: ProcessVersion <ProcessVersion@gmail.com>
 * @example
 * const modlog = await fetchModlog(this.connection, message.guild.id)
 * @async
 * @param {object} connection - Command / event connection
 * @param {string} id - Guild ID
 * @returns {Promise} Modlog for guild
 */
async function fetchModlog(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT modLogId FROM GuildLogging WHERE guildId = '${id}'`
	);
	const modlog = await res[0][0].modLogId;
	if (modlog == null || modlog == "null") {
		return null;
	} else {
		return modlog;
	}
}
/**
 * @function fetchRoleLog
 * @description Fetch the role log for the guild
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @example
 * const rolelog = await fetchRoleLog(this.connection, message.guild.id)
 * @async
 * @param {object} connection - Command / event connection
 * @param {string} id - Guild ID
 * @returns {Promise} Role log for guild
 */
async function fetchRoleLog(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT roleLogId FROM GuildLogging WHERE guildId = '${id}'`
	);

	const rolelog = await res[0][0].roleLogId;
	if (rolelog == null) {
		return null;
	} else if (rolelog == "null") {
		return null;
	} else {
		return rolelog;
	}
}
/**
 * @function fetchAppeals
 * @description Fetch the appeals channel
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @example
 * const appeals = await fetchAppeals(this.connection, message.guild.id)
 * @async
 * @param {object} connection - Command / event connection
 * @param {string} id - Guild ID
 * @returns {Promise} Appeals channel for guild
 */
async function fetchAppeals(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT appealsId FROM GuildLogging WHERE guildId = '${id}'`
	);

	const appeals = await res[0][0].appealsId;
	if (appeals == null) {
		return null;
	} else if (appeals == "null") {
		return null;
	} else {
		return appeals;
	}
}
/**
 * @function fetchReports
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Fetch the reports channel for the guild_only
 * @example
 * const reports = await fetchReports = await fetchReports(this.connection, message.guild.id)
 * @async
 * @param {object} connection - Command / event connection
 * @param {string} id - Guild ID
 * @returns {Promise} Reports channel for guild
 */
async function fetchReports(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT reportsId FROM GuildLogging WHERE guildId = '${id}'`
	);

	const reports = await res[0][0].reportsId;
	return reports;
}
/**
 * @function fetchActionLog
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Fetch the action log for the guild
 * @example
 * const actionlog = await fetchActionLog(this.connection, message.guild.id)
 * @async
 * @param {object} connection - Command / event connection
 * @param {string} id - Guild ID
 * @returns {Promise} Actionlog for guild
 */
async function fetchActionLog(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT actionLogId FROM GuildLogging WHERE guildId = '${id}'`
	);

	const actionlog = await res[0][0].actionLogId;
	return actionlog;
}
/**
 * @function fetchSuggestions
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Fetch suggestions channel for the guild
 * @example
 * const suggestions = await fetchSuggestions(this.connection, message.guild.id)
 * @async
 * @param {object} connection - Command / event connection
 * @param {string} id - Guild ID
 * @returns {Promise} Suggestions channel for guild
 */
async function fetchSuggestions(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT suggestionsId FROM GuildLogging WHERE guildId = '${id}'`
	);

	const suggestions = await res[0][0].suggestionsId;
	return suggestions;
}
/**
 * @function fetchMessageLog
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Fetch message log for the guild
 * @example
 * const messagelog = await fetchMessageLog(this.connection, message.guild.id)
 * @async
 * @param {object} connection - Command / event connection
 * @param {string} id - Guild ID
 * @returns {Promise} MessageLog for guild
 */
async function fetchMessageLog(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT messageLogId FROM GuildLogging WHERE guildId = '${id}'`
	);

	const messagelog = await res[0][0].messageLogId;
	return messagelog;
}
/**
 * @function fetchServerLog
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Fetch server log for the guild
 * @example
 * consst serverLog = await fetchServerLog(this.connection, message.guild.id)
 * @async
 * @param {object} connection Command / event connection
 * @param {string} id Guild ID
 * @returns {Promise} Server log for guild
 */
async function fetchServerLog(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT serverLogId FROM GuildLogging WHERE guildId = '${id}'`
	);

	const serverlog = await res[0][0].serverLogId;
	return serverlog;
}
/**
 * @function fetchInviteLog
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Fetch the invite log for the guild
 * @example
 * const invitelog = await fetchInviteLog(this.connection, message.guild.id)
 * @async
 * @param {object} connection Command / event connection
 * @param {string} id Guild ID
 * @returns {Promise} Invite log for guild
 */
async function fetchInviteLog(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT inviteLogId FROM GuildLogging WHERE guildId = '${id}'`
	);

	const invitelog = await res[0][0].inviteLogId;
	return invitelog;
}
/**
 * @function fetchEmojiLog
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Fetch emoji log for the guild
 * @example
 * const emojilog = await fetchEmojiLog(this.connection, message.guild.id)
 * @async
 * @param {object} connection Command / event connection
 * @param {string} id Guild ID
 * @returns {Promise} Emoji log for guild
 */
async function fetchEmojiLog(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT emojiLogId FROM GuildLogging WHERE guildId = '${id}'`
	);

	const emojilog = await res[0][0].emojiLogId;
	if (emojilog == "null") {
		return null;
	} else if (emojilog == null) {
		return null;
	} else {
		return emojilog;
	}
}
/**
 * @function fetchChannelLog
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Fetch channel log for the guild
 * @example
 * const channellog = await fetchChannelLog(this.connection, message.guild.id)
 * @async
 * @param {object} connection Command / event connection
 * @param {string} id Guild ID
 * @returns {Promise} Channel log for guild
 */
async function fetchChannelLog(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT channelLogId FROM GuildLogging WHERE guildId = '${id}'`
	);

	const channelLog = await res[0][0].channelLogId;
	if (channelLog == null) {
		return null;
	} else if (channelLog == "null") {
		return null;
	} else {
		return channelLog;
	}
}

/**
 * @function fetchPublicModlog
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @example
 * const publicmodlog = await fetchPublicModlog(this.connection, message.guild.id)
 * @description Fetch public modlog for the guild
 * @async
 * @param {object} connection Command / event connection
 * @param {string} id Guild ID
 * @returns {Promise} Public modlog ID for guild
 */
async function fetchPublicModlog(connection, id) {
	if (!connection)
		throw new ReferenceError("Connection is a required parameter");
	if (!id) throw new ReferenceError("ID is a required parameter");

	const res = await connection.query(
		`SELECT publicModLogId FROM GuildLogging WHERE guildId = '${id}'`
	);

	const publicmodlog = await res[0][0].publicModLogId;
	if (publicmodlog == null) {
		return null;
	} else if (publicmodlog == "null") {
		return null;
	} else {
		return publicmodlog;
	}
}
/**
 * @function colour
 * @description Generates random colour
 * @example
 * .setColor(colour())
 * @generator Colour
 * @returns {string} colour
 */
function colour() {
	const ranNum = Math.floor(Math.random() * colours.length);
	const colour = colours[ranNum];
	return colour;
}
/**
 * @function BaseSuccessEmbed
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Base Success embed (notifies user of success)
 * @example
 * const embed = await BaseSuccessEmbed(client, message, this)
 * embed.setDescription("Successfully set modlog to #rules")
 * @async
 * @param {object} client Discord.js client
 * @param {object} message Discord.js message
 * @param {object} command Command object
 * @returns {object} Title, Timestamp, Thumbnail, Color, Footer
 */
async function BaseSuccessEmbed(client, message, command) {
	if (!client) throw new TypeError("Message is a required parameter.");
	if (!message) throw new TypeError("Client is a required parameter.");
	if (!command) throw new TypeError("Command is a required parameter.");

	const lang = await getLang(message.guild.id, command.connection);

	return (
		new MessageEmbed()
			.setAuthor(
				client.user.username,
				client.user.displayAvatarURL({ dynamic: true })
			)
			.setTitle(`${success_emoji} | ${capitalize(getString(lang, "success"))}`)
			// Description (IN command)
			.setTimestamp()
			.setThumbnail(
				message.guild
					? message.guild.iconURL({ dynamic: true })
					: client.user.displayAvatarURL({ dynamic: true })
			)
			.setColor(colour())
			.setFooter(
				`${capitalize(command.name)} command | ${client.user.username}`,
				client.user.displayAvatarURL({ dynamic: true })
			)
	);
}
/**
 * @function BaseImageEmbed
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Embed for images
 * @example
 * const embed = BaseImageEmbed(client, message, this)
 * embed.setImage(client.user.displayAvatarURL({ dynamic: true }))
 * @param {object} client Discord.js client
 * @param {object} message Discord.js message
 * @param {object} command Command object
 * @returns {object} Timestamp, Color, Footer
 */
function BaseImageEmbed(client, message, command) {
	if (!message) throw new ReferenceError("Message is a required parameter.");
	if (!client) throw new ReferenceError("Client is a required parameter.");
	if (!command) throw new ReferenceError("Command is a required parameter.");

	return (
		new MessageEmbed()
			.setAuthor(
				client.user.username,
				client.user.displayAvatarURL({ dynamic: true })
			)
			// Title [FILL IN COMMAND]
			// Description [FILL IN COMMAND]
			.setTimestamp()
			// image/thumbnail in command
			.setColor(colour())
			.setFooter(
				`${capitalize(command.name)} command | ${client.user.username}`,
				client.user.displayAvatarURL({ dynamic: true })
			)
	);
}

/**
 * @function BaseHelpEmbed
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Help embed layout
 * @example
 * return await BaseHelpEmbed(client, message, this)
 * @async
 * @param {object} client Discord.js client
 * @param {object} message Discord.js message
 * @param {object} command Command object
 * @returns {object} 4 paginated embeds
 */
async function BaseHelpEmbed(client, message, command) {
	if (!client) throw new ReferenceError("Message is a required parameter.");
	if (!message) throw new ReferenceError("Client is a required parameter.");
	if (!command) throw new ReferenceError("Command is a required parameter.");

	const lang = await getLang(message.guild.id, command.connection);
	const prefix = await fetchPrefix(command.connection, message.guild.id);

	// strings

	const strings = {
		titles: {
			status: getString(lang, "status"),
			working: getString(lang, "working"),
			name: getString(lang, "name"),
			category: getString(lang, "category"),
			aliases: getString(lang, "aliases"),
			usage: getString(lang, "usage"),
			description: getString(lang, "description"),
			accessible_by: getString(lang, "accessible_by"),
			permissions: getString(lang, "permissions"),
			subCommands: getString(lang, "sub_commands"),
			example: getString(lang, "example"),
			guild_only: getString(lang, "guildonly"),
			owner_only: getString(lang, "owner_only"),
			cooldown: getString(lang, "cooldown"),
			user_permissions: getString(lang, "user_permissions"),
		},
		values: {
			yes: getString(lang, "yes"),
			no: getString(lang, "no"),
			none: getString(lang, "none"),
			is_required: getString(lang, "is_required"),
			is_optional: getString(lang, "is_optional"),
			seconds: getString(lang, "seconds"),
		},
	};

	let alias;
	let botperms;
	let userperms;
	let subcommands;
	let examples;
	if (command.aliases.length == 0) {
		alias = `\`${capitalize(strings.values.none)}\``;
	} else {
		alias = command.aliases.map((e) => `\`${e}\``).join(", ");
	}

	if (command.permissions.length == 0) {
		botperms = `\`${capitalize(strings.values.none)}\``;
	} else {
		botperms = command.permissions.map((e) => `\`${e}\``).join(", ");
	}

	if (command.userPermissions.length == 0) {
		userperms = `\`${capitalize(strings.values.none)}\``;
	} else {
		userperms = command.userPermissions.map((e) => `\`${e}\``).join(", ");
	}
	if (command.SubCommands.length == 0) {
		subcommands = `\`${capitalize(strings.values.none)}\``;
	} else {
		subcommands = command.SubCommands.map((e) => `\`${prefix}${e}`).join(",\n");
	}
	if (command.example.length == 0) {
		examples = `\`${capitalize(strings.values.none)}\``;
	} else {
		examples = command.example.map((e) => `\`${prefix}${e}\``).join(",\n");
	}

	const embed1 = new MessageEmbed()
		.setAuthor(
			client.user.username,
			client.user.displayAvatarURL({ dynamic: true })
		)
		.setTitle(
			`${capitalize(command.name)} help | ${strings.titles.status}: ${
				command.commandstatus.toLowerCase() == "working"
					? `${capitalize(strings.titles.working)}`
					: `${command.commandstatus}`
			}`
		)
		.setDescription(
			`\`<>\` ${strings.values.is_required} | \`()\` ${strings.values.is_optional}`
		)
		.addField(
			"\u200B",
			`${capitalize(strings.titles.name)}: \`${command.name}\`\n${capitalize(
				strings.titles.category
			)}: \`${command.category}\`\n${capitalize(
				strings.titles.cooldown
			)}: \`${Math.floor((command.cooldown / 1000) % 60).toString()}\` ${
				strings.values.seconds
			}\n${capitalize(strings.titles.aliases)}: ${alias}`
		)
		.setThumbnail(
			message.guild
				? message.guild.iconURL({ dynamic: true })
				: client.user.iconURL({ dynamic: true })
		)
		.setColor(colour())
		.setTimestamp();
	const embed2 = new MessageEmbed()
		.setAuthor(
			client.user.username,
			client.user.displayAvatarURL({ dynamic: true })
		)
		.setTitle(
			`${capitalize(command.name)} help | ${strings.titles.status}: ${
				command.commandstatus.toLowerCase() == "working"
					? `${capitalize(strings.titles.working)}`
					: `${command.commandstatus}`
			}`
		)
		.setDescription(
			`\`<>\` ${strings.values.is_required} | \`()\` ${strings.values.is_optional}`
		)
		.addField(
			"\u200B",
			`${capitalize(strings.titles.accessible_by)}: ${
				command.accessibleby
			}\n${capitalize(strings.titles.description)}: \`${await translate(
				lang,
				command.description
			)}\`\nUsage: \`${command.usage}\``
		)
		.setThumbnail(
			message.guild
				? message.guild.iconURL({ dynamic: true })
				: client.user.iconURL({ dynamic: true })
		)
		.setColor(colour())
		.setTimestamp();
	const embed3 = new MessageEmbed()
		.setAuthor(
			client.user.username,
			client.user.displayAvatarURL({ dynamic: true })
		)
		.setTitle(
			`${capitalize(command.name)} help | ${strings.titles.status}: ${
				command.commandstatus.toLowerCase() == "working"
					? `${capitalize(strings.titles.working)}`
					: `${command.commandstatus}`
			}`
		)
		.setDescription(
			`\`<>\` ${strings.values.is_required} | \`()\` ${strings.values.is_optional}`
		)
		.addField(
			"\u200B",
			`${capitalize(strings.titles.guild_only)}? \`${
				command.guildOnly == true
					? `${capitalize(strings.values.yes)}`
					: `${capitalize(strings.values.no)}`
			}\`\nNSFW? \`${
				command.nsfw == true
					? `${capitalize(strings.values.yes)}`
					: `${capitalize(strings.values.no)}`
			}\`\n${capitalize(strings.titles.owner_only)}? \`${
				command.owner == true
					? `${capitalize(strings.values.yes)}`
					: `${capitalize(strings.values.no)}\``
			}`
		)
		.setThumbnail(
			message.guild
				? message.guild.iconURL({ dynamic: true })
				: client.user.iconURL({ dynamic: true })
		)
		.setColor(colour())
		.setTimestamp();
	const embed4 = new MessageEmbed()
		.setAuthor(
			client.user.username,
			client.user.displayAvatarURL({ dynamic: true })
		)
		.setTitle(
			`${capitalize(command.name)} help | ${strings.titles.status}: ${
				command.commandstatus.toLowerCase() == "working"
					? `${capitalize(strings.titles.working)}`
					: `${command.commandstatus}`
			}`
		)
		.setDescription(
			`\`<>\` ${strings.values.is_required} | \`()\` ${strings.values.is_optional}`
		)
		.addField(
			"\u200B",
			`${capitalize(strings.titles.permissions)}: ${botperms}\n${capitalize(
				strings.titles.user_permissions
			)}: ${userperms}\n${capitalize(
				strings.titles.example
			)}:\n ${examples}\n${capitalize(
				strings.titles.subCommands
			)}:\n ${subcommands}`
		)
		.setThumbnail(
			message.guild
				? message.guild.iconURL({ dynamic: true })
				: client.user.iconURL({ dynamic: true })
		)
		.setColor(colour())
		.setTimestamp();

	const pages = [embed1, embed2, embed3, embed4];

	return pagination(message, pages);
}
/**
 * @function BaseGeneratingEmbed
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @example
 * const embed = await BaseGeneratingEmbed(client, message, this)
 * embed.setDescription("Provided by: \`API\`")
 * @async
 * @param {object} client Discord.js client
 * @param {object} message Discord.js message
 * @param {object} command Command object
 * @returns {object} Title, Timestamp, Thumbnail, Color, Footer
 */
async function BaseGeneratingEmbed(client, message, command) {
	if (!client) throw new ReferenceError("Message is a required parameter.");
	if (!message) throw new ReferenceError("Client is a required parameter.");
	if (!command) throw new ReferenceError("Command is a required parameter");

	const lang = await getLang(message.guild.id, command.connection);

	return (
		new MessageEmbed()
			.setAuthor(
				client.user.username,
				client.user.displayAvatarURL({ dynamic: true })
			)
			.setTitle(`${loading} | ${capitalize(getString(lang, "generating"))}...`)
			// Description (IN command)
			.setTimestamp()
			.setThumbnail(
				message.guild
					? message.guild.iconURL({ dynamic: true })
					: client.user.displayAvatarURL({ dynamic: true })
			)
			.setColor(colour())
			.setFooter(
				`${capitalize(command.name)} command | ${client.user.username}`,
				client.user.displayAvatarURL({ dynamic: true })
			)
	);
}
/**
 * @function BaseErrorEmbed
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @async
 * @example
 * const embed = await BaseErrorEmbed(client, message, this)
 * embed.setDescription("\`\`\`Error details: Error\`\`\`")
 * @param {object} client Discord.js client
 * @param {object} message Discord.js message
 * @param {object} command Command object
 * @returns {object} Title, Timestamp, Thumbnail, Color, Footer
 */
async function BaseErrorEmbed(client, message, command) {
	if (!client) throw new ReferenceError("Message is a required parameter.");
	if (!message) throw new ReferenceError("Client is a required parameter.");
	if (!command) throw new ReferenceError("Command is a required parameter.");

	const lang = await getLang(message.guild.id, command.connection);

	return (
		new MessageEmbed()
			.setAuthor(
				client.user.username,
				client.user.displayAvatarURL({ dynamic: true })
			)
			.setTitle(
				`${error_emoji} | ${capitalize(getString(lang, "error_message"))}`
			)
			// Description [FILL IN COMMAND]
			.setTimestamp()
			.setThumbnail(
				message.guild
					? message.guild.iconURL({ dynamic: true })
					: client.user.displayAvatarURL({ dynamic: true })
			)
			.setColor(colour())
			.setFooter(
				`${capitalize(command.name)} command | ${client.user.username}`,
				client.user.displayAvatarURL({ dynamic: true })
			)
	);
}
/**
 * @function BaseEmbed
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @param {object} client Discord.js client
 * @param {object} message Discord.js message
 * @param {object} command Command object
 * @example
 * const embed = BaseEmbed(client, message, this)
 * @returns {object} Title, Timestamp, Thumbnail, Color, Footer
 */
function BaseEmbed(client, message, command) {
	if (!message) throw new ReferenceError("Message is a required parameter.");
	if (!client) throw new ReferenceError("Client is a required parameter.");
	if (!command) throw new ReferenceError("Command is a required parameter.");

	return (
		new MessageEmbed()
			.setAuthor(
				client.user.username,
				client.user.displayAvatarURL({ dynamic: true })
			)
			.setTitle(`${capitalize(command.name)} command`)
			// Description [FILL IN COMMAND]
			.setTimestamp()
			.setThumbnail(
				message.guild
					? message.guild.iconURL({ dynamic: true })
					: client.user.displayAvatarURL({ dynamic: true })
			)
			.setColor(colour())
			.setFooter(
				`${capitalize(command.name)} command | ${client.user.username}`,
				client.user.displayAvatarURL({ dynamic: true })
			)
	);
}
/**
 * @function formatNumber
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Puts commas in between numbers to format them.
 * @example
 * formatNumber(999999)
 * @param {number} x Number to format
 * @returns {string} Number with commas
 */
function formatNumber(x) {
	if (typeof x !== "number")
		throw new ReferenceError("Param must be a number.");
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Initiates the bots connection
 * @example
 * connection = await initConnection()
 * @returns {object} connection
 */
async function initConnection() {
	connection = await require("../../../Database/DB");
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Check if currency is enabled in given guild
 * @param {string} guildId
 * @param {object} connection
 * @example
 * const enabled = await currencyEnabled(message.guild.id, this.connection);
 * @returns {Boolean} check what currency is for the guild.
 */
async function currencyEnabled(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing a required id");
	if (!connection) throw new ReferenceError("Connection is required");

	const result = await connection.query(
		`SELECT isEnabled FROM economy WHERE guildId = '${guildId}'`
	);
	const enabled = await result[0][0].isEnabled;
	let value;
	if (enabled == 0) {
		value = false;
	} else {
		value = true;
	}
	return value;
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Gets the users economy objects
 * @example
 * const profile = await getEconomyProfile(message.guild.id, message.author.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The user id
 * @param {object} connection MySQL connection
 * @returns {object} profile
 */
async function getEconomyProfile(guildId, userId, connection) {
	if (!guildId) throw new ReferenceError("Missing a required id");
	if (!userId) throw new ReferenceError("Missing a required user Id");
	if (!connection) throw new ReferenceError("Missing a required connection");
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Get the currency for the guild
 * @example
 * const currency = await getCurrency(message.guild.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {object} connection MySQL connection
 * @returns {String} The currency for the guild
 */
async function getCurrency(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing a required id ");
	if (!connection) throw new ReferenceError("Missing a required connection");

	const enabled = await currencyEnabled(guildId, connection);
	if (enabled == true) {
		const result = await connection.query(
			`SELECT currency FROM economy WHERE guildId = '${guildId}'`
		);
		const currency = await result[0][0].currency;
		return currency;
	}
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Get a users balance
 * @example
 * const balance = await getBalance(message.guild.id, message.author.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The user ID
 * @param {object} connection MySQL connection
 * @returns {object} The uses balance
 */
async function getBalance(guildId, userId, connection) {
	if (!guildId) throw new ReferenceError("Missing a required ID");
	if (!connection) throw new ReferenceError("Missing a required connection");

	const enabled = await currencyEnabled(guildId, connection);
	if (enabled == true) {
		const res = await connection.query(
			`SELECT balance FROM GuildMemberEconomy WHERE guildId = '${guildId}' AND userId = '${userId}'`
		);
		const balance = res[0][0].balance;
		return balance;
	}
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Check if the user claimed their weekly money
 * @example
 * const claimed = await claimedWeekly(message.guild.id, message.author.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The user ID
 * @param {object} connection MySQL connection
 * @returns {Boolean} To check if the user has claimed
 */
async function claimedWeekly(guildId, userId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!userId) throw new ReferenceError("Missing user id");
	if (!connection) throw new ReferenceError("Missing required Connection");
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Check if the user has claimed their daily amount
 * @example
 * const claimed = await claimedDaily(message.guild.id, message.author.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The User ID
 * @param {object} connection MySQL connection
 * @returns {Boolean} To check if daily is already claimed
 */
async function claimedDaily(guildId, userId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!userId) throw new ReferenceError("Missing user id");
	if (!connection) throw new ReferenceError("Missing required Connection");
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description See if the user has claimed their yearly amount
 * @example
 * const claimed = await claimedYealy(message.guild.id, message.author.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The user ID
 * @param {object} connection MySQL connection
 * @returns {Boolean} Check if yearly has been claimed
 */
async function claimedYearly(guildId, userId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!userId) throw new ReferenceError("Missing user id");
	if (!connection) throw new ReferenceError("Missing required Connection");
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Check the starter balance for the guild
 * @example
 * const start = await getStarterBalance(message.guild.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {object} connection MySQL connection
 * @returns {object} Returns the starter balance for the guild
 */
async function getStarterBalance(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!connection) throw new ReferenceError("Missing required Connection");

	const enabled = await currencyEnabled(guildId, connection);

	if (enabled == true) {
		const res = await connection.query(
			`SELECT startBalance FROM economy WHERE guildId = '${guildId}'`
		);
		const balance = await res[0][0].startBalance;
		return balance;
	}
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Get the audit log for the guild
 * @example
 * const auditLog = await getAuditLog(message.guild.id, this.connection)
 * @param {String} guildId
 * @param {object} connection
 * @returns {object} The audit log for the guild
 */
async function getAuditLog(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!connection) throw new ReferenceError("Missing required Connection");

	const enabled = await currencyEnabled(guildId, connection);

	if (enabled == true) {
		const res = await connection.query(
			`SELECT auditLog FROM economy WHERE guildId = '${guildId}'`
		);
		const auditLog = await res[0][0].auditLog;
		return auditLog;
	}
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Get the total bank for the guild
 * @example
 * cont totalBank = await getTotalBank(message.guild.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {object} connection MySQL connection
 * @returns {object} Get the total amount in the bank for the guild
 */
async function getTotalBank(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!connection) throw new ReferenceError("Missing required Connection");

	const enabled = await currencyEnabled(guildId, connection);
	if (enabled == true) {
		const res = await connection.query(
			`SELECT totalBank FROM economy WHERE guildId = '${guildId}'`
		);
		const totalBank = res[0][0].totalBank;
		return totalBank;
	}
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Get the total amount of cash in the guild
 * @example
 * const totalCash = await getTotalCash(message.guild.id, this.connection);
 * @param {String} guildId The guild ID
 * @param {object} connection MySQL connection
 * @returns {object} Get the total amount of cash in the guild
 */
async function getTotalCash(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!connection) throw new ReferenceError("Missing required Connection");

	const enabled = await currencyEnabled(guildId, connection);

	if (enabled == true) {
		const res = await connection.query(
			`SELECT totalCash FROM economy WHERE guildId = '${guildId}'`
		);
		const totalCash = res[0][0].totalCash;
		return totalCash;
	}
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Get the total net worth for the guild
 * @example
 * const netWorth = await getTotalNetWorth(message.guild.id, this.connection);
 * @param {String} guildId The guild ID
 * @param {object} connection MySQL connection
 * @returns {object} The total net worth for the guild
 */
async function getTotalNetWorth(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!connection) throw new ReferenceError("Missing required Connection");

	const enabled = await currencyEnabled(guildId, connection);

	if (enabled == true) {
		const res = await connection.query(
			`SELECT totalNetWorth FROM economy WHERE guildId = '${guildId}'`
		);
		const totalNetWorth = await res[0][0].totalNetWorth;
		return totalNetWorth;
	}
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Check if the XP system is enabled in the guild
 * @example
 * const enabled = await xpEnabled(message.guild.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {object} connection MySQL connection
 * @returns {object} Returns if the xp is enabled
 */
async function xpEnabled(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!connection) throw new ReferenceError("Missing required Connection");

	const result = await connection.query(
		`SELECT isEnabled FROM xpsystem WHERE guildId = '${guildId}'`
	);
	const enabled = await result[0][0].isEnabled;
	let value;
	if (enabled == 0) {
		value = false;
	} else {
		value = true;
	}
	return value;
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Get the users profile in a guild..
 * @example
 * const userProfile = await getUserProfile(message.guild.id, message.author.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The user ID
 * @param {object} connection MySQL connection
 * @returns {object} Returns the users profile in a guild
 */
async function getUserProfile(guildId, userId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild ID");
	if (!userId) throw new ReferenceError("Missing user id");
	if (!connection) throw new ReferenceError("Missing connection");
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Checks the min amount for the guild
 * @example
 * const min = await getMinAmount(message.guild.id, this.connection)
 * @param {String|Number} guildId The guild ID
 * @param {object} connection MySQL connection
 * @returns {object} Returns the min amount for the guild
 */
async function getMinAmount(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!connection) throw new ReferenceError("Missing required Connection");

	const enabled = await xpEnabled(guildId, connection);
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Gets the amx amount for the guild
 * @example
 * const max = await getMaxAmount(message.guild.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {object} connection MySQL connection
 * @returns {object} Returns max amount for the guild
 */
async function getMaxAmount(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!connection) throw new ReferenceError("Missing required Connection");
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Gets the users level for the guild
 * @example
 * const level = await getLevel(message.guild.id, message.author.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId THe user ID
 * @param {object} connection MySQL connection
 * @returns {object} Returns the users level
 */
async function getLevel(guildId, userId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!userId) throw new ReferenceError("Missing user id");
	if (!connection) throw new ReferenceError("Missing required Connection");
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Gets the users xp points in a guild
 * @example
 * const xpPoints = getXpPoints(message.guild.id, message.author.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The user ID
 * @param {object} connection MySQL connection
 * @returns {object} Get the users xp points
 */
async function getXpPoints(guildId, userId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!userId) throw new ReferenceError("Missing user id");
	if (!connection) throw new ReferenceError("Missing required Connection");
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Check if chat money is enabled
 * @example
 * enabledChatMoney(message.guild.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {object} connection MySQL connection
 * @returns {object} Check if chat money is enabled
 */
async function enabledChatMoney(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!connection) throw new ReferenceError("Missing required Connection");
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Gets the minimum amount for the guild
 * @example
 * minAmountChat(message.guild.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {object} connection MySQL connection
 * @returns {object} Returns the min amount for the guild
 */
async function minAmountChat(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!connection) throw new ReferenceError("Missing required Connection");
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Set the max amount for chat
 * @example
 * maxAmountChat(message.guild.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {object} connection MySQL connection
 * @returns {object} Changes the max amount for the guild
 */
async function maxAmountChat(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!connection) throw new ReferenceError("Missing required Connection");
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Create an XP profile for the user
 * @example
 * createXpProfile(message.guild.id, message.author.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The user ID
 * @param {object} connection MySQL connection
 * @returns {object} Creates a new profile for the user
 */
async function createXpProfile(guildId, userId, connection) {
	if (!guildId) throw new ReferenceError("Missing a required ID");
	if (!userId) throw new ReferenceError("Missing user id");
	if (!connection) throw new ReferenceError("Missing connection");
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Create an economy profile for the user
 * @example
 * createEconomyProfile(message.guild.id, message.author.id, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The user ID
 * @param {object} connection MySQL connection
 * @returns {object} Creates a new economy profile for a user
 */
async function createEconomyProfile(guildId, userId, connection) {
	if (!guildId) throw new ReferenceError("Missing a required ID");
	if (!userId) throw new ReferenceError("Missing a required user ID");
	if (!connection) throw new ReferenceError("Missing a required connection");
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Adds XP to the mentioned user
 * @example
 * addXp(message.guild.id, message.author.id, 5, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The user ID
 * @param {String|Number} amount The amount to add
 * @param {object} connection MySQL connection
 * @returns {object} Adds XP to the user
 */
async function addXp(guildId, userId, amount, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!userId) throw new ReferenceError("Missing user id");
	if (!amount) throw new ReferenceError("Missing amount");
	if (!connection) throw new ReferenceError("Missing required Connection");
}
/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Removes the XP from the given user
 * @example
 * removeXp(message.guild.id, message.author.id, 5, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The user ID
 * @param {Number|String} amount The amount to remove
 * @param {object} connection MySQL connection
 * @returns {object} Removes xp from the given user
 */
async function removeXp(guildId, userId, amount, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!userId) throw new ReferenceError("Missing user id");
	if (!amount) throw new ReferenceError("Missing amount");
	if (!connection) throw new ReferenceError("Missing required Connection");
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Adds money to a user
 * @example
 * addMoney(message.guild.id, message.author.id, 5, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The user ID
 * @param {Number|String} amount The amount to add
 * @param {object} connection MySQL connection
 * @returns {object} Add money to a user
 */
async function addMoney(guildId, userId, amount, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!userId) throw new ReferenceError("Missing user id");
	if (!amount) throw new ReferenceError("Missing amount");
	if (!connection) throw new ReferenceError("Missing required Connection");
}

/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Remove money from a user
 * @example
 * removeMoney(message.guild.id, message.author.id, 5, this.connection)
 * @param {String} guildId The guild ID
 * @param {String} userId The user ID
 * @param {Number|String} amount The money to remove
 * @param {object} connection MySQL connection
 * @returns {object} Removes the money
 */
async function removeMoney(guildId, userId, amount, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!userId) throw new ReferenceError("Missing user id");
	if (!amount) throw new ReferenceError("Missing amount");
	if (!connection) throw new ReferenceError("Missing required Connection");
}

/**
 * @async
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Gets the case number for the guild
 * @example
 * const case = await getCaseNumber(message.guild.id, this.connection);
 * @param {String} guildId
 * @param {object} connection
 * @returns {String|Number}
 */
async function getCaseNumber(guildId, connection) {
	if (!guildId) throw new ReferenceError("Missing guild ID");
	if (!connection) throw new ReferenceError("Missing required connection");

	const result = await connection.query(
		`SELECT caseNumber FROM GuildModerations WHERE guildId = '${guildId}'`
	);
	const caseNumber = await result[0];
	const mappedCaseNumber = caseNumber.map((r) => r.caseNumber);
	const updatedCaseNumber = mappedCaseNumber.length + 1;
	return updatedCaseNumber;
}

/**
 * @async
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @description Inserts a moderation for the guild
 * @example
 * await insertModeration(message.guild.id, 'ban', '1', message.author.id, this.connection, { reason: reason, user: user.id, modlog: modlog.id, publicmodlog: publicmodlog.id })
 * @param {String} guildId
 * @param {String} moderation
 * @param {String|Number} caseNumber
 * @param {String} moderatorId
 * @param {object} connection
 * @param {object} options
 */
async function insertModeration(
	guildId,
	moderation,
	caseNumber,
	moderatorId,
	connection,
	options = {
		reason,
		user,
		modlog,
		publicmodlog,
		modlogId,
		publicmodlogId,
		moderationDate,
		updatedAt,
		updatedBy,
	}
) {
	if (!guildId) throw new ReferenceError("Guild ID is required");
	if (!moderation) throw new ReferenceError("Moderation is required");
	if (!caseNumber) throw new ReferenceError("Case number is required");
	if (!moderatorId) throw new ReferenceError("Moderator ID is required");
	if (!connection) throw new ReferenceError("Connection is required");

	const obj = {
		guildId: guildId,
		moderation: moderation,
		case: caseNumber,
		moderator: moderatorId,
		reason: options.reason ? options.reason : null,
		user: options.user ? options.user : null,
		modlog: options.modlog ? options.modlog : null,
		publicmodlog: options.publicmodlog ? options.publicmodlog : null,
		modlogId: options.modlogId ? options.modlogId : null,
		publicmodlogId: options.publicmodlogId ? options.publicmodlogId : null,
		modDate: options.moderationDate ? options.moderationDate : null,
		updatedAt: options.updatedAt ? options.updatedAt : null,
		updatedBy: options.updatedBy ? options.updatedBy : null,
	};

	try {
		await connection.query(
			`INSERT INTO GuildModerations (guildId, moderation, reason, caseNumber, moderatorId, userId, messageId, publicMessageId, modLogId, publicLogId, moderationDate, lastUpdated, updatedBy) VALUES('${obj.guildId}', '${obj.moderation}', '${obj.reason}', '${obj.case}', '${obj.moderator}', '${obj.user}', '${obj.modlog}', '${obj.publicmodlog}', '${obj.modlogId}', '${obj.publicmodlogId}', '${obj.modDate}', '${obj.updatedAt}', '${obj.updatedBy}')`
		);
	} catch (e) {
		console.log(e);
	}
}

async function fetchModeration(guildId, caseNumber, connection) {
	if (!guildId) throw new ReferenceError("Missing guild id");
	if (!caseNumber) throw new ReferenceError("Missing case number");
	if (!connection) throw new ReferenceError("Missing connection");

	const res = await connection.query(
		`SELECT * FROM GuildModerations WHERE guildId = '${guildId}' AND caseNumber = '${caseNumber}'`
	);
	const moderation = await res[0][0];
	return moderation;
}

module.exports = {
	capitalize,
	paginate,
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
	colour,
	BaseSuccessEmbed,
	BaseImageEmbed,
	BaseHelpEmbed,
	BaseGeneratingEmbed,
	BaseErrorEmbed,
	BaseEmbed,
	formatNumber,
	translate,
	getDescription,
	getString,
	getLang,
	initConnection,
	currencyEnabled,
	getCurrency,
	getBalance,
	claimedWeekly,
	claimedDaily,
	claimedYearly,
	getStarterBalance,
	getAuditLog,
	getTotalBank,
	getTotalCash,
	getTotalNetWorth,
	xpEnabled,
	getMinAmount,
	getMaxAmount,
	getLevel,
	getXpPoints,
	enabledChatMoney,
	minAmountChat,
	maxAmountChat,
	addXp,
	removeXp,
	addMoney,
	removeMoney,
	getCaseNumber,
	insertModeration,
	fetchModeration,
};

class ErrorEmbed {
	async apiError(client, message, command) {}
	async userperms(client, message, command) {}
	async botperms(client, message, command) {}
}
