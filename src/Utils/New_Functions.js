const pagination = require("discord.js-pagination");
const connection = require("./StateManager");
const { MessageEmbed } = require("discord.js");
const language = require("../../languages.json");
const descriptions = require("../../descriptions.json");
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
} = require("../../colours.json");
const { success_emoji, error_emoji, loading } = require("../../emojis.json");
const translateapi = require("@iamtraction/google-translate");
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

class Translator {
	constructor() {
		this.translate = this.translate.bind(this);
		this.getLang = this.getLang.bind(this);
		this.getDescription = this.getDescription.bind(this);
		this.getString = this.getString.bind(this);
		this.connection = connection.connection;
	}
	/**
	 * Translate the given string
	 * ** Reconlx video
	 * @param {String} lang - Guild language
	 * @param {String} text - Text to translate
	 * @returns {Promise<String>} translated string
	 * @example
	 * const translation = await translate(lang, "hello")
	 */
	async translate(lang, text) {
		if (!lang) throw new ReferenceError("Language is a required parameter");
		if (!text) throw new ReferenceError("Text is a required parameter");

		const translated = await translateapi(text, { from: "en", to: lang });
		return translated.text;
	}
	/**
	 * Gets the language of the guild.
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id Guild ID
	 * @param {object} connection Command / event connection
	 * @returns {Promise<String>} ISO language code
	 * @example
	 * const lang = await getLang(message.guild.id)
	 */
	async getLang(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");
		const res = await this.connection.query(
			`SELECT lang FROM GuildConfigurable WHERE guildId = '${id}'`
		);
		const lang = await res[0][0].lang;
		return lang;
	}
	/**
	 * Gets a translation from the languages.json file
	 * ** From stackoverflow w/ a bit of modification from me 🙏🙏🙏🙏
	 * @param {String} lang Language used by user / Guild
	 * @param {String} string String to look for
	 * @param  {...any} vars Vars to fill in
	 * @returns {String} Translated string
	 * @example
	 * const provided_by = getString(lang, "provided_by")
	 */
	getString(lang, string, ...vars) {
		let locale = language[lang][string];

		if (vars.length !== 0 || vars.length !== null) {
			vars.forEach((i) => {
				locale = locale.replace(/%VAR%/, i);
			});
		}
		return locale;
	}
	/**
	 * Get the description of a command VIA the command name.
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} lang The language to get the description for
	 * @param {String} string Command name.
	 * @returns {String} Returns translated string
	 * @example
	 * getDescription(lang, this.name)
	 */
	getDescription(lang, string) {
		let locale = descriptions[string][lang].description;
		return locale;
	}
}

class Utils {
	constructor() {
		this.capitalize = this.capitalize.bind(this);
		this.paginate = this.paginate.bind(this);
		this.formatNumber = this.formatNumber.bind(this);
		this.Duration = this.Duration.bind(this);
		this.connection = connection.connection;
	}
	Duration(ms) {
		const sec = Math.floor((ms / 1000) % 60).toString();
		const min = Math.floor((ms / (1000 * 60)) % 60).toString();
		const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
		const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
		return `${days.padStart(1, "0")} days, ${hrs.padStart(
			2,
			"0"
		)} hours, ${min.padStart(2, "0")} minutes and ${sec.padStart(
			2,
			"0"
		)} seconds`;
	}
	/**
	 * Applies a capital letter to the first letter in the string
	 * ** From Stackoverflow 🙏🙏🙏
	 * @param {String} string String to capitalize
	 * @returns {String} with first letter capitalized
	 * @example
	 * capitalize("hello world")
	 */
	capitalize(string) {
		if (!string) throw new ReferenceError("No value given");
		if (typeof string !== "string")
			throw new ReferenceError("Given value is not a string");
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	/**
	 * Paginate embeds using the Discord.js-pagination module
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @example
	 * return paginate(message, embed1, embed2, embed3, embed4)
	 * @param {object} message Discord.js message object
	 * @param  {...any} args Embeds to paginate
	 * @returns {object} paginated embeds
	 */
	paginate(message, ...args) {
		if (!message)
			throw new ReferenceError(`Error: Message is a required parameter`);
		if (args.length <= 1 || args.length <= "1" || !args)
			throw new ReferenceError("Error: Must include more than one embed");

		return pagination(message, args);
	}
	/**
	 * Puts commas in between numbers to format them.
	 * ** From Stackoverflow 🙏🙏🙏🙏
	 * @example
	 * formatNumber(999999)
	 * @param {number} x Number to format
	 * @returns {String} Number with commas
	 */
	formatNumber(x) {
		if (typeof x != "number") parseInt(x);
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}

class Colour {
	constructor() {
		this.set = this.set.bind(this);
		this.connection = connection.connection;
	}
	/**
	 * Get a colour
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} colour
	 * @param {object} options
	 * @returns {String} Colour
	 * @example
	 * .setColor(set()) // for random
	 * .setColor(set("red")) // for red
	 * .setColor(set("red", { shade: "dark"})) // for dark red
	 */
	set(colour, options) {
		if (!colour) colour = "random";
		let shade;
		if (options) {
			shade = options.shade ? options.shade : null;
		}
		if ((colour != "random" && shade != undefined) || shade != null) {
			const color = colours.indexOf(`${colour}_${shade}`);
			if (color == -1)
				throw new ReferenceError("This colour / shade cannot be found!");
			const value = colours[color];
			return value;
		}
		if (colour == "random") {
			const ranNum = Math.floor(Math.random() * colours.length);
			const colour = colours[ranNum];
			return colour;
		}
		if ((colour && shade == undefined) || shade == null) {
			const color = colours.indexOf(`${colour}`);
			if (color == -1)
				throw new ReferenceError(`Referenced colour doesn't exist!`);
			const value = colours[color];
			return value;
		}
	}
}

class Channels {
	constructor() {
		this.Memberlog = this.Memberlog.bind(this);
		this.Modlog = this.Modlog.bind(this);
		this.Rolelog = this.Rolelog.bind(this);
		this.Appeals = this.Appeals.bind(this);
		this.Reports = this.Reports.bind(this);
		this.Actionlog = this.Actionlog.bind(this);
		this.Suggestions = this.Suggestions.bind(this);
		this.Messagelog = this.Messagelog.bind(this);
		this.Serverlog = this.Serverlog.bind(this);
		this.Invitelog = this.Invitelog.bind(this);
		this.Channellog = this.Channellog.bind(this);
		this.Emojilog = this.Emojilog.bind(this);
		this.Publicmodlog = this.Publicmodlog.bind(this);
		this.connection = connection.connection;
	}
	/**
	 * Fetches the memberlog for the guild.
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id - Guild ID
	 * @returns {Promise<String>} MemberLog for guild
	 * @example
	 * const memberLog = await Memberlog(message.guild.id)
	 */
	async Memberlog(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");

		try {
			const res = await this.connection.query(
				`SELECT memberLogId FROM GuildLogging WHERE guildId = '${id}'`
			);
			const memberLog = await res[0][0].memberLogId;

			if (memberLog == null || memberLog == "null") {
				return null;
			} else {
				return memberLog;
			}
		} catch (e) {
			console.log(e);

			return null;
		}
	}
	/**
	 * Fetches the modlog for the guild
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id - Guild ID
	 * @returns {Promise<String>} Modlog for guild
	 * @example
	 * const modlog = await Modlog(message.guild.id)
	 */
	async Modlog(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");
		try {
			const res = await this.connection.query(
				`SELECT modLogId FROM GuildLogging WHERE guildId = '${id}'`
			);
			const modlog = await res[0][0].modLogId;
			if (modlog == null || modlog == "null") {
				return null;
			} else {
				return modlog;
			}
		} catch (e) {
			console.log(e);

			return null;
		}
	}
	/**
	 * Fetch the role log for the guild
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id - Guild ID
	 * @returns {Promise<String>} Role log for guild
	 * @example
	 * const rolelog = await Rolelog(message.guild.id)
	 */
	async Rolelog(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");

		try {
			const res = await this.connection.query(
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
		} catch (e) {
			console.log(e);

			return null;
		}
	}
	/**
	 * Fetch the appeals channel
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id - Guild ID
	 * @returns {Promise<String>} Appeals channel for guild
	 * @example
	 * const appeals = await Appeals(message.guild.id)
	 */
	async Appeals(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");
		try {
			const res = await this.connection.query(
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
		} catch (e) {
			console.log(e);

			return null;
		}
	}
	/**
	 * Fetch the reports channel
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id - Guild ID
	 * @returns {Promise<String>} Reports channel for guild
	 * @example
	 * const reports = await Reports = await Reports(message.guild.id)
	 */
	async Reports(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");
		try {
			const res = await this.connection.query(
				`SELECT reportsId FROM GuildLogging WHERE guildId = '${id}'`
			);

			const reports = await res[0][0].reportsId;
			if (reports == "null") {
				return null;
			} else {
				return reports;
			}
		} catch (e) {
			console.log(e);
			return null;
		}
	}
	/**
	 * Fetch the action log for the guild
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id - Guild ID
	 * @returns {Promise<String>} Actionlog for guild
	 * @example
	 * const actionlog = await Actionlog(message.guild.id)
	 */
	async Actionlog(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");
		try {
			const res = await this.connection.query(
				`SELECT actionLogId FROM GuildLogging WHERE guildId = '${id}'`
			);

			const actionlog = await res[0][0].actionLogId;
			if (actionlog == "null") {
				return null;
			} else {
				return actionlog;
			}
		} catch (e) {
			console.log(e);

			return null;
		}
	}
	/**
	 * Fetch suggestions channel for the guild
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id - Guild ID
	 * @returns {Promise<String>} Suggestions channel for guild
	 * @example
	 * const suggestions = await Suggestions(message.guild.id)
	 */
	async Suggestions(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");
		try {
			const res = await this.connection.query(
				`SELECT suggestionsId FROM GuildLogging WHERE guildId = '${id}'`
			);

			const suggestions = await res[0][0].suggestionsId;
			if (suggestions == "null") {
				return null;
			} else {
				return suggestions;
			}
		} catch (e) {
			console.log(e);

			return null;
		}
	}
	/**
	 * Fetch message log for the guild
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id - Guild ID
	 * @returns {Promise<String>} MessageLog for guild
	 * @example
	 * const messagelog = await Messagelog(this.connection, message.guild.id)
	 */
	async Messagelog(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");
		try {
			const res = await this.connection.query(
				`SELECT messageLogId FROM GuildLogging WHERE guildId = '${id}'`
			);

			const messagelog = await res[0][0].messageLogId;
			if (messagelog == "null") {
				return null;
			} else {
				return messagelog;
			}
		} catch (e) {
			console.log(e);

			return null;
		}
	}
	/**
	 * Fetch server log for the guild
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id Guild ID
	 * @returns {Promise<String>} Server log for guild
	 * @example
	 * const serverLog = await Serverlog(message.guild.id)
	 */
	async Serverlog(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");
		try {
			const res = await this.connection.query(
				`SELECT serverLogId FROM GuildLogging WHERE guildId = '${id}'`
			);

			const serverlog = await res[0][0].serverLogId;
			return serverlog;
		} catch (e) {
			console.log(e);

			return null;
		}
	}
	/**
	 * Fetch the invite log for the guild
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id Guild ID
	 * @returns {Promise<String>} Invite log for guild
	 * @example
	 * const invitelog = await Invitelog(message.guild.id)
	 */
	async Invitelog(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");

		const res = await this.connection.query(
			`SELECT inviteLogId FROM GuildLogging WHERE guildId = '${id}'`
		);

		const invitelog = await res[0][0].inviteLogId;
		if (invitelog == "null") {
			return null;
		} else {
			return invitelog;
		}
	}
	/**
	 * Fetch emoji log for the guild
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id Guild ID
	 * @returns {Promise<String>} Emoji log for guild
	 * @example
	 * const emojilog = await Emojilog(message.guild.id)
	 */
	async Emojilog(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");
		try {
			const res = await this.connection.query(
				`SELECT emojiLogId FROM GuildLogging WHERE guildId = '${id}'`
			);

			const emojilog = await res[0][0].emojiLogId;
			if (emojilog == "null") {
				return null;
			} else {
				return emojilog;
			}
		} catch (e) {
			console.log(e);

			return null;
		}
	}
	/**
	 * Fetch channel log for the guild
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id Guild ID
	 * @returns {Promise<String>} Channel log for guild
	 * @example
	 * const channellog = await Channellog(this.connection, message.guild.id)
	 */
	async Channellog(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");
		try {
			const res = await this.connection.query(
				`SELECT channelLogId FROM GuildLogging WHERE guildId = '${id}'`
			);

			const channelLog = await res[0][0].channelLogId;
			if (channelLog == null) {
				return null;
			} else {
				return channelLog;
			}
		} catch (e) {
			console.log(e);

			return null;
		}
	}
	/**
	 * Fetch public modlog for the guild
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} id Guild ID
	 * @returns {Promise<String>} Public modlog ID for guild
	 * @example
	 * const publicmodlog = await Publicmodlog(message.guild.id)
	 */
	async Publicmodlog(id) {
		if (!id) throw new ReferenceError("ID is a required parameter");

		const res = await this.connection.query(
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
}

class Settings {
	constructor() {
		this.FetchPrefix = this.FetchPrefix.bind(this);
		this.connection = connection.connection;
	}
	/**
	 * Fetch the prefix for a guild
	 * @author Mohammad El-Hassan <ProcessVersion@gmail.com>
	 * @param {String|Number} id
	 * @returns {String} Guild prefix
	 * @example
	 * const prefix = await FetchPrefix(message.guild.id)
	 */
	async FetchPrefix(id) {
		if (!id) throw new ReferenceError("Missing requried ID to fetch prefix");

		try {
			const res = await this.connection.query(
				`SELECT cmdPrefix FROM GuildConfigurable WHERE guildId = '${id}'`
			);
			const prefix = await res[0][0].cmdPrefix;
			return prefix;
		} catch (e) {
			console.log(e);
		}
	}
}
class Economy {}
class Xp {}

class ErrorEmbed {
	constructor() {
		this.Base = this.Base.bind(this);
		this.ApiError = this.ApiError.bind(this);
		this.CooldownError = this.CooldownError.bind(this);
		this.InvalidChoice = this.InvalidChoice.bind(this);
		this.MissingPermissions = this.MissingPermissions.bind(this);
		this.NoResult = this.NoResult.bind(this);
		this.NsfwError = this.NsfwError.bind(this);
		this.UnexpectedError = this.UnexpectedError.bind(this);
		this.connection = connection.connection;
		this.capitalize = new Utils().capitalize;
		this.getLang = new Translator().getLang;
		this.getString = new Translator().getString;
		this.set = new Colour().set;
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @param {String} options.error_message
	 * @returns {Promise<object>}
	 */
	async Base(options = { client, iconURL, id, command, text, error_message }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL) throw new ReferenceError("Missing an icon URL");
		if (!options.id) throw new ReferenceError("Guild id is required");
		if (!options.error_message)
			throw new ReferenceError("An error message is required");

		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");

		let footer;
		if (options.command && !options.command)
			footer = `${capitalize(options.command.name)} command | ${
				options.client.user.username
			}`;
		if (!options.command && options.text)
			footer = `${capitalize(options.text)} | ${options.client.user.username}`;

		const lang = await this.getLang(options.id);

		return new MessageEmbed()
			.setAuthor(options.client.user.username, options.iconURL)
			.setTitle(
				`${error_emoji} | ${this.capitalize(
					this.getString(lang, "error_message")
				)}`
			)
			.setDescription(
				`\`\`\`Error details: ${this.capitalize(options.error_message)}\`\`\``
			)
			.setTimestamp()
			.setThumbnail(options.iconURL)
			.setColor(this.set())
			.setFooter(footer, options.iconURL);
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async ApiError(options = { client, iconURL, id, command, text }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");

		return await this.Base({
			client: options.client,
			iconURL: options.iconURL,
			command: options.command,
			text: options.text,
			id: options.id,
			error_message: "API error",
		});
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async NsfwError(options = { client, iconURL, id, command, text }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon URL is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");

		return await this.Base({
			client: options.client,
			iconURL: options.iconURL,
			id: options.id,
			command: options.command,
			text: options.text,
			error_message: "NSFW error",
		});
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async CooldownError(options = { client, iconURL, id, text, toUse, seconds }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.conURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.text) throw new ReferenceError("Text is a required argument");
		if (!options.toUse)
			throw new ReferenceError("Command is a required argument");
		if (!options.seconds)
			throw new ReferenceError("Seconds is a requried argument");

		const lang = await this.getLang(options.id);

		const second = `${options.seconds} ${this.getString(lang, "seconds")}`;
		const description = `${this.capitalize(
			this.getString(lang, "cooldown_message", second, `${options.toUse}`)
		)}`;

		return await this.Base({
			client: options.client,
			iconURL: options.iconURL,
			id: options.id,
			text: options.text,
			error_message: description,
		});
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async UnexpectedError(options = { client, id, iconURL, text, command }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");

		const lang = await this.getLang(options.id);

		const description = this.getString(lang, "unexpected_error");

		try {
			return await this.Base({
				client: options.client,
				iconURL: options.iconURL,
				command: options.command,
				text: options.text,
				id: options.id,
				error_message: description,
			});
		} catch (e) {
			console.log(e);
		}
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async InvalidChoice(options = { client, id, iconURL, text, command }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");

		try {
			return await this.Base({
				client: options.client,
				iconURL: options.iconURL,
				id: options.id,
				command: options.command,
				text: options.text,
				error_message: "Invalid choice!",
			});
		} catch (e) {
			console.log(e);
		}
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async NoResult(options = { client, iconURL, id, text, command }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");

		try {
			return await this.Base({
				client: options.client,
				iconURL: options.iconURL,
				id: options.id,
				command: options.command,
				text: options.text,
				error_message: "No result(s) found!",
			});
		} catch (e) {
			console.log(e);
		}
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async MissingPermissions(options = { client, iconURL, id, text, command }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");

		try {
			return await this.Base({
				client: options.client,
				iconURL: options.iconURL,
				id: options.id,
				command: options.command,
				text: options.text,
				error_message: "Missing permissions",
			});
		} catch (e) {
			console.log(e);
		}
	}
}

class SuccessEmbed {
	constructor() {
		this.Base = this.Base.bind(this);
		this.capitalize = new Utils().capitalize;
		this.set = new Colour().set;
		this.getString = new Translator().getString;
		this.getLang = new Translator().getLang;
	}
	/**
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {String} options.text
	 * @param {object} options.command
	 * @param {String} options.success_message
	 * @returns {Promise<object>}
	 */
	async Base(
		options = { client, iconURL, id, text, command, success_message }
	) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.success_message)
			throw new ReferenceError("A message of some sort is required");

		return new Promise(async (resolve, reject) => {
			try {
				let footer;
				if (options.command && !options.text)
					footer = `${this.capitalize(options.command.name)} command | ${
						options.client.user.username
					}`;
				if (!options.command && options.text)
					footer = `${this.capitalize(options.text)} | ${
						options.client.user.username
					}`;

				const lang = await this.getLang(options.id);
				const embed = new MessageEmbed()
					.setAuthor(options.client.user.username, options.iconURL)
					.setTitle(
						`${success_emoji} | ${this.capitalize(
							this.getString(lang, "success")
						)}`
					)
					.setDescription(`${options.success_message}`)
					.setTimestamp()
					.setThumbnail(options.iconURL)
					.setColor(this.set())
					.setFooter(footer, options.iconURL);
				resolve(embed);
			} catch (e) {
				reject("An unexpected error has occurred");
			}
		});
	}
}
class Embed {
	constructor() {
		this.Base = this.Base.bind(this);
		this.capitalize = new Utils().capitalize;
		this.set = new Colour().set;
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {object} options.command
	 * @param {String} options.text
	 * @param {String} options.description
	 * @param {String} options.title
	 * @param {Array} options.fields
	 * @param {String} options.link
	 * @returns {Promise<object>}
	 */
	async Base(
		opts = {
			client,
			iconURL,
			command,
			text,
			description,
			title,
			fields,
			link,
		}
	) {
		if (!opts.client) throw new ReferenceError("Client is a required param");
		if (!opts.iconURL) throw new ReferenceError("Icon url is a required param");
		if (!opts.description)
			throw new ReferenceError("Description is a required param");
		if (!opts.command && !opts.text)
			throw new ReferenceError("Some form of text is required!");
		if (opts.command && opts.text) throw new ReferenceError("Please pick one");
		if (!opts.title) throw new ReferenceError("Missing a title");
		if (!opts.fields) opts.fields = null;
		if (!opts.link) opts.link = null;

		let footer;
		if (opts.command && !opts.text)
			footer = `${this.capitalize(opts.command.name)} command | ${
				opts.client.user.username
			}`;
		if (!opts.command && opts.text)
			footer = `${this.capitalize(opts.text)} | ${opts.client.user.username}`;
		return new Promise((resolve, reject) => {
			try {
				const embed = new MessageEmbed()
					.setAuthor(opts.client.user.username, opts.iconURL)
					.setTitle(opts.title)
					.setDescription(opts.description)
					.setTimestamp()
					.setThumbnail(opts.iconURL)
					.setColor(this.set())
					.setFooter(footer, opts.iconURL);

				if (opts.fields != null) {
					opts.fields.forEach((o) => {
						embed.addField(o.name, o.value);
					});
				}
				if (opts.link != null) {
					embed.setAuthor(opts.client.user.username, opts.iconURL, opts.link);
					embed.setURL(opts.link);
				}
				resolve(embed);
			} catch (e) {
				console.log(e);

				reject(e);
			}
		});
	}
}
class HelpEmbed {
	constructor() {
		this.Base = this.Base.bind(this);
		this.getLang = new Translator().getLang;
		this.getString = new Translator().getString;
		this.translate = new Translator().translate;
		this.set = new Colour().set;
		this.paginate = new Utils().paginate;
		this.capitalize = new Utils().capitalize;
		this.FetchPrefix = new Settings().FetchPrefix;
	}
	/**
	 * Base help embed
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} opts
	 * @param {object} opts.client
	 * @param {String} opts.iconURL
	 * @param {object} opts.command
	 * @param {object} opts.message
	 * @returns {Promise<object>}
	 */
	async Base(opts = { client, iconURL, command, message }) {
		const self = this;
		if (!opts.client) throw new ReferenceError("Client is a required param");
		if (!opts.message) throw new ReferenceError("ID is a required param");
		if (!opts.iconURL) throw new ReferenceError("Icon url is a required param");
		if (!opts.command) throw new ReferenceError("Command is a required param");

		const lang = await self.getLang(opts.message.guild.id);
		const prefix = await this.FetchPrefix(opts.message.guild.id);

		const strings = {
			titles: {
				status: self.getString(lang, "status"),
				working: self.getString(lang, "working"),
				name: self.getString(lang, "name"),
				category: self.getString(lang, "category"),
				aliases: self.getString(lang, "aliases"),
				usage: self.getString(lang, "usage"),
				description: self.getString(lang, "description"),
				accessible_by: self.getString(lang, "accessible_by"),
				permissions: self.getString(lang, "permissions"),
				subCommands: self.getString(lang, "sub_commands"),
				example: self.getString(lang, "example"),
				guild_only: self.getString(lang, "guildonly"),
				owner_only: self.getString(lang, "owner_only"),
				cooldown: self.getString(lang, "cooldown"),
				user_permissions: self.getString(lang, "user_permissions"),
			},
			values: {
				yes: self.getString(lang, "yes"),
				no: self.getString(lang, "no"),
				none: self.getString(lang, "none"),
				is_required: self.getString(lang, "is_required"),
				is_optional: self.getString(lang, "is_optional"),
				seconds: self.getString(lang, "seconds"),
			},
		};
		let alias;
		let botperms;
		let userperms;
		let subcommands;
		let examples;
		if (opts.command.aliases.length == 0) {
			alias = `\`${self.capitalize(strings.values.none)}\``;
		} else {
			alias = opts.command.aliases.map((e) => `\`${e}\``).join(", ");
		}

		if (opts.command.permissions.length == 0) {
			botperms = `\`${self.capitalize(strings.values.none)}\``;
		} else {
			botperms = opts.command.permissions.map((e) => `\`${e}\``).join(", ");
		}

		if (opts.command.userPermissions.length == 0) {
			userperms = `\`${self.capitalize(strings.values.none)}\``;
		} else {
			userperms = opts.command.userPermissions
				.map((e) => `\`${e}\``)
				.join(", ");
		}
		if (opts.command.SubCommands.length == 0) {
			subcommands = `\`${self.capitalize(strings.values.none)}\``;
		} else {
			subcommands = opts.command.SubCommands.map((e) => `\`${prefix}${e}`).join(
				",\n"
			);
		}
		if (opts.command.example.length == 0) {
			examples = `\`${self.capitalize(strings.values.none)}\``;
		} else {
			examples = opts.command.example
				.map((e) => `\`${prefix}${e}\``)
				.join(",\n");
		}
		const embed1 = new MessageEmbed()
			.setAuthor(opts.client.user.username, opts.iconURL)
			.setTitle(
				`${self.capitalize(opts.command.name)} help | ${
					strings.titles.status
				}: ${
					opts.command.commandstatus.toLowerCase() == "working"
						? `${self.capitalize(strings.titles.working)}`
						: `${opts.command.commandstatus}`
				}`
			)
			.setDescription(
				`\`<>\` ${strings.values.is_required} | \`()\` ${strings.values.is_optional}`
			)
			.addField(
				`${self.capitalize(strings.titles.name)}:`,
				`\`${opts.command.name}\``
			)
			.addField(
				`${self.capitalize(strings.titles.category)}:`,
				`\`${opts.command.category}\``
			)
			.addField(
				`${self.capitalize(strings.titles.cooldown)}:`,
				`\`${Math.floor((opts.command.cooldown / 1000) % 60).toString()}\` ${
					strings.values.seconds
				}`
			)
			.addField(`${self.capitalize(strings.titles.aliases)}:`, `${alias}`)
			.setThumbnail(opts.iconURL)
			.setColor(self.set())
			.setTimestamp();
		const embed2 = new MessageEmbed()
			.setAuthor(opts.client.user.username, opts.iconURL)
			.setTitle(
				`${self.capitalize(opts.command.name)} help | ${
					strings.titles.status
				}: ${
					opts.command.commandstatus.toLowerCase() == "working"
						? `${self.capitalize(strings.titles.working)}`
						: `${opts.command.commandstatus}`
				}`
			)
			.setDescription(
				`\`<>\` ${strings.values.is_required} | \`()\` ${strings.values.is_optional}`
			)
			.addField(
				`${self.capitalize(strings.titles.accessible_by)}:`,
				`${opts.command.accessibleby}`
			)
			.addField(
				`${self.capitalize(strings.titles.description)}:`,
				`\`${await self.translate(lang, opts.command.description)}\``
			)
			.addField(`Usage:`, `\`${opts.command.usage}\``)
			.setThumbnail(opts.iconURL)
			.setColor(self.set())
			.setTimestamp();
		const embed3 = new MessageEmbed()
			.setAuthor(opts.client.user.username, opts.iconURL)
			.setTitle(
				`${self.capitalize(opts.command.name)} help | ${
					strings.titles.status
				}: ${
					opts.command.commandstatus.toLowerCase() == "working"
						? `${self.capitalize(strings.titles.working)}`
						: `${opts.command.commandstatus}`
				}`
			)
			.setDescription(
				`\`<>\` ${strings.values.is_required} | \`()\` ${strings.values.is_optional}`
			)
			.addField(
				`${self.capitalize(strings.titles.guild_only)}?`,
				`\`${
					opts.command.guildOnly == true
						? `${self.capitalize(strings.values.yes)}`
						: `${self.capitalize(strings.values.no)}`
				}\``
			)
			.addField(
				`NSFW`,
				`\`${
					opts.command.nsfw == true
						? `${self.capitalize(strings.values.yes)}`
						: `${self.capitalize(strings.values.no)}`
				}\``
			)
			.addField(
				`${self.capitalize(strings.titles.owner_only)}?`,
				`\`${
					opts.command.owner == true
						? `${self.capitalize(strings.values.yes)}`
						: `${self.capitalize(strings.values.no)}\``
				}`
			)
			.setThumbnail(opts.iconURL)
			.setColor(self.set())
			.setTimestamp();
		const embed4 = new MessageEmbed()
			.setAuthor(opts.client.user.username, opts.iconURL)
			.setTitle(
				`${self.capitalize(opts.command.name)} help | ${
					strings.titles.status
				}: ${
					opts.command.commandstatus.toLowerCase() == "working"
						? `${self.capitalize(strings.titles.working)}`
						: `${opts.command.commandstatus}`
				}`
			)
			.setDescription(
				`\`<>\` ${strings.values.is_required} | \`()\` ${strings.values.is_optional}`
			)
			.addField(
				`${self.capitalize(strings.titles.permissions)}:`,
				`${botperms}`
			)
			.addField(
				`${self.capitalize(strings.titles.user_permissions)}`,
				`${userperms}`
			)
			.addField(`${self.capitalize(strings.titles.example)}`, `${examples}`)
			.addField(
				`${self.capitalize(strings.titles.subCommands)}`,
				`${subcommands}`
			)
			.setThumbnail(opts.iconURL)
			.setColor(self.set())
			.setTimestamp();

		return self.paginate(opts.message, embed1, embed2, embed3, embed4);
	}
}

class GeneratingEmbed {
	constructor() {
		this.Base = this.Base.bind(this);
		this.DogCeoApi = this.DogCeoApi.bind(this);
		this.NekosLife = this.NekosLife.bind(this);
		this.NekoBot = this.NekoBot.bind(this);
		this.DiscordIG = this.DiscordIG.bind(this);
		this.Duncte123 = this.Duncte123.bind(this);
		this.NoApiKey = this.NoApiKey.bind(this);
		this.SomeRandomApi = this.SomeRandomApi.bind(this);
		this.connection = connection.connection;
		this.capitalize = new Utils().capitalize;
		this.set = new Colour().set;
		this.getString = new Translator().getString;
		this.getLang = new Translator().getLang;
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @param {String} options.provider
	 * @returns {Promise<object>}
	 */
	async Base(options = { client, iconURL, id, command, text, provider }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("You need to specify an icon");
		if (!options.id) throw new ReferenceError("Please specify a guild");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");
		if (!options.provider)
			throw new ReferenceError("You must specify a provider");

		try {
			let footer;
			if (options.command && !options.text)
				footer = `${this.capitalize(options.command.name)} command | ${
					options.client.user.username
				}`;
			if (!options.command && options.text)
				footer = `${this.capitalize(options.text)} | ${
					options.client.user.username
				}`;

			const lang = await this.getLang(options.id);

			return new MessageEmbed()
				.setAuthor(options.client.user.username, options.iconURL)
				.setTitle(
					`${loading} | ${this.capitalize(
						this.getString(lang, "generating")
					)}...`
				)
				.setDescription(
					`${this.capitalize(this.getString(lang, "provided_by"))}: \`${
						options.provider
					}\``
				)
				.setTimestamp()
				.setThumbnail(options.iconURL)
				.setColor(this.set())
				.setFooter(footer, options.iconURL);
		} catch (e) {
			console.log(e);
		}
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async DogCeoApi(options = { client, iconURL, id, command, text }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");

		try {
			return await this.Base({
				client: options.client,
				iconURL: options.iconURL,
				command: options.command,
				id: options.id,
				text: options.text,
				provider: `Dog CEO API`,
			});
		} catch (e) {
			console.log(e);
		}
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async NekosLife(options = { client, iconURL, id, command, text }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");

		try {
			return await this.Base({
				client: options.client,
				iconURL: options.iconURL,
				id: options.id,
				command: options.command,
				text: options.text,
				provider: `Nekos life API`,
			});
		} catch (e) {
			console.log(e);
		}
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async NekoBot(options = { client, iconURL, id, command, text }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");

		try {
			return await this.Base({
				client: options.client,
				iconURL: options.iconURL,
				id: options.id,
				command: options.command,
				text: options.text,
				provider: `NekoBot API`,
			});
		} catch (e) {
			console.log(e);
		}
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async DiscordIG(options = { client, iconURL, id, command, text }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");
		try {
			return await this.Base({
				client: options.client,
				iconURL: options.iconURL,
				id: options.id,
				command: options.command,
				text: options.text,
				provider: `Discord-image-generation`,
			});
		} catch (e) {
			console.log(e);
		}
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async SomeRandomApi(options = { client, iconURL, id, command, text }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");
		try {
			return await this.Base({
				client: options.client,
				iconURL: options.iconURL,
				id: options.id,
				command: options.command,
				text: options.text,
				provider: `Some-random-api`,
			});
		} catch (e) {
			console.log(e);
		}
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async NoApiKey(options = { client, iconURL, id, command, text }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");
		try {
			return await this.Base({
				client: options.client,
				iconURL: options.iconURL,
				id: options.id,
				command: options.command,
				text: options.text,
				provider: `No-api-key API`,
			});
		} catch (e) {
			console.log(e);
		}
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @returns {Promise<object>}
	 */
	async Duncte123(options = { client, iconURL, id, command, text }) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon url is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");
		try {
			return await this.Base({
				client: options.client,
				iconURL: options.iconURL,
				id: options.id,
				command: options.command,
				text: options.text,
				provider: `Duncte123 API`,
			});
		} catch (e) {
			console.log(e);
		}
	}
}
class ImageEmbed {
	constructor() {
		this.Base = this.Base.bind(this);
		this.capitalize = new Utils().capitalize;
		this.set = new Colour().set;
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {object} options.client
	 * @param {String} options.iconURL
	 * @param {String|Number} options.id
	 * @param {object} options.command
	 * @param {String} options.text
	 * @param {String} options.title
	 * @param {String} options.description
	 * @param {String} options.image
	 * @returns {Promise<object>}
	 */
	Base(
		options = { client, iconURL, id, command, text, title, description, image }
	) {
		if (!options.client) throw new ReferenceError("Client is a required param");
		if (!options.iconURL)
			throw new ReferenceError("Icon URL is a required param");
		if (!options.id) throw new ReferenceError("ID is a required param");
		if (!options.title) throw new ReferenceError("Title is a required param");
		if (!options.description)
			throw new ReferenceError("A description of some sort is required!");
		if (!options.command && !options.text)
			throw new ReferenceError("Some form of text is required!");
		if (options.command && options.text)
			throw new ReferenceError("Please pick one");
		if (!options.image)
			throw new ReferenceError("You are missing the required image");

		let footer;
		if (options.command && !options.text)
			footer = `${this.capitalize(options.command.name)} command | ${
				options.client.user.username
			}`;
		if (!options.command && options.text)
			footer = `${this.capitalize(options.text)} | ${
				options.client.user.username
			}`;

		return new Promise((resolve, reject) => {
			try {
				const embed = new MessageEmbed()
					.setAuthor(options.client.user.username, options.iconURL)
					.setTitle(options.title)
					.setDescription(options.description)
					.setTimestamp()
					.setThumbnail(options.iconURL)
					.setColor(this.set())
					.setImage(options.image)
					.setFooter(footer, options.iconURL);
				resolve(embed);
			} catch (e) {
				console.log(e);

				return reject(null);
			}
		});
	}
}

class Moderation {
	constructor() {
		this.fetchModeration = this.fetchModeration.bind(this);
		this.insertModeration = this.insertModeration.bind(this);
		this.connection = connection.connection;
	}
	/**
	 * Inserts a moderation for the guild
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} guildId The guild ID
	 * @param {String} moderation The moderation type (ban, kick etc...)
	 * @param {String|Number} caseNumber The case number (fetch case number prior to using this function)
	 * @param {String} moderatorId The moderator ID
	 * @param {object} options Optional extra information
	 * @returns {object}
	 * @example
	 * await insertModeration(message.guild.id, 'ban', '1', message.author.id, this.connection, { reason: reason, user: user.id, modlog: modlog.id, publicmodlog: publicmodlog.id })
	 */
	async insertModeration(
		guildId,
		moderation,
		caseNumber,
		moderatorId,
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
			await this.connection.query(
				`INSERT INTO GuildModerations (guildId, moderation, reason, caseNumber, moderatorId, userId, messageId, publicMessageId, modLogId, publicLogId, moderationDate, lastUpdated, updatedBy) VALUES('${obj.guildId}', '${obj.moderation}', '${obj.reason}', '${obj.case}', '${obj.moderator}', '${obj.user}', '${obj.modlog}', '${obj.publicmodlog}', '${obj.modlogId}', '${obj.publicmodlogId}', '${obj.modDate}', '${obj.updatedAt}', '${obj.updatedBy}')`
			);
		} catch (e) {
			console.log(e);
		}
	}
	async fetchModeration(guildId, caseNumber) {
		if (!guildId) throw new ReferenceError("Missing guild id");
		if (!caseNumber) throw new ReferenceError("Missing case number");

		try {
			const res = await this.connection.query(
				`SELECT * FROM GuildModerations WHERE guildId = '${guildId}' AND caseNumber = '${caseNumber}'`
			);
			const moderation = await res[0][0];
			return moderation;
		} catch (e) {
			console.log(e);

			return null;
		}
	}
}

module.exports = {
	Colour,
	Translator,
	Utils,
	Channels,
	Settings,
	Economy,
	Xp,
	ErrorEmbed,
	SuccessEmbed,
	Embed,
	HelpEmbed,
	GeneratingEmbed,
	ImageEmbed,
	Moderation,
};
