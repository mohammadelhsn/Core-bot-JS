const con = require("../StateManager");
const emojis = require("../../../emojis.json");
const {
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
} = require("../New_Functions");
const { Animals, Canvas, Facts, Fun, Reactions } = require("./Api/api");
const Get = require("./Get");

/**
 * @typedef {Object} Base
 * @property {String} name
 * @property {String} category
 * @property {Array} aliases
 * @property {String} usage
 * @property {String} description
 * @property {String} accessibleby
 * @property {Array} permissions
 * @property {Array} SubCommands
 * @property {Array} example
 * @property {String|Boolean} guildOnly
 * @property {String|Number} cooldown
 * @property {String|Boolean} owner
 * @property {String|Boolean} nsfw
 * @property {Array} userPermissions
 * @property {String} commandstatus
 * @property {Object} con
 * @property {Object} Emojis
 * @property {String} Emojis.error_emoji
 * @property {String} Emojis.success_emoji
 * @property {String} Emojis.yepp_light
 * @property {String} Emojis.nah_light
 * @property {String} Emojis.dark_yep
 * @property {String} Emojis.dark_nah
 * @property {String} Emojis.verified
 * @property {String} Emojis.bruh
 * @property {String} Emojis.eyesshaking
 * @property {String} Emojis.cry
 * @property {String} Emojis.wot
 * @property {String} Emojis.online_emoji
 * @property {String} Emojis.dnd_emoji
 * @property {String} Emojis.idle_emoji
 * @property {String} Emojis.offline_emoji
 * @property {String} Emojis.streaing_emoji
 * @property {String} Emojis.on_switch
 * @property {String} Emojis.off_switch
 * @property {String} Emojis.loading_discord
 * @property {String} Emojis.loading
 * @property {String} Emojis.bot_emoji
 * @property {String} Emojis.information_emoji
 * @property {String} Emojis.hypesquad_brilliance
 * @property {String} Emojis.hypesquad_bravery
 * @property {String} Emojis.hypesquad_balance
 * @property {String} Emojis.hypesquad_events
 * @property {String} Emojis.discord_partner
 * @property {String} Emojis.discord_bot_dev
 * @property {String} Emojis.upvote
 * @property {String} Emojis.downvote
 * @property {String} Emojis.earlysupporter
 * @property {String} Emojis.bug_hunter
 * @property {String} Emojis.bug_hunter_2
 * @property {String} Emojis.discord_staff
 * @property {String} Emojis.system
 * @property {Object} Colour
 * @property {Function} Colour.set
 * @property {Object} Translator
 * @property {Function} Translator.translate
 * @property {Function} Translator.getLang
 * @property {Function} Translator.getDescription
 * @property {Function} Translator.getString
 * @property {Object} Utils
 * @property {Function} Utils.capitalize
 * @property {Function} Utils.paginate
 * @property {Function} Utils.formatNumber
 * @property {Function} Utils.initConnection
 * @property {Object} Channels
 * @property {Function} Channels.Memberlog
 * @property {Function} Channels.Modlog
 * @property {Function} Channels.Rolelog
 * @property {Function} Channels.Appeals
 * @property {Function} Channels.Reports
 * @property {Function} Channels.Actionlog
 * @property {Function} Channels.Suggestions
 * @property {Function} Channels.Messagelog
 * @property {Function} Channels.Serverlog
 * @property {Function} Channels.Invitelog
 * @property {Function} Channels.Channellog
 * @property {Function} Channels.Emojilog
 * @property {Function} Channels.Publicmodlog
 * @property {Object} Settings
 * @property {Object} Economy
 * @property {Object} Xp
 * @property {Object} ErrorEmbed
 * @property {Function} ErrorEmbed.Base
 * @property {Function} ErrorEmbed.ApiError
 * @property {Function} ErrorEmbed.CooldownError
 * @property {Function} ErrorEmbed.InvalidChoice
 * @property {Function} ErrorEmbed.MissingPermissions
 * @property {Function} ErrorEmbed.NoResult
 * @property {Function} ErrorEmbed.NsfwError
 * @property {Function} ErrorEmbed.UnexpectedError
 * @property {Object} SuccessEmbed
 * @property {Function} SuccessEmbed.Base
 * @property {Object} Embed
 * @property {Function} Embed.Base
 * @property {Object} HelpEmbed
 * @property {Object} GeneratingEmbed
 * @property {Function} GeneratingEmbed.Base
 * @property {Function} GeneratingEmbed.DogCeoApi
 * @property {Function} GeneratingEmbed.NekoBot
 * @property {Function} GeneratingEmbed.NekosLife
 * @property {Function} GeneratingEmbed.DiscordIG
 * @property {Function} GeneratingEmbed.Duncte123
 * @property {Function} GeneratingEmbed.NoApiKey
 * @property {Function} GeneratingEmbed.SomeRandomApi
 * @property {Object} ImageEmbed
 * @property {Function} ImageEmbed.Base
 * @property {Object} Moderation
 * @property {Function} Moderation.fetchModeration
 * @property {Function} Moderation.insertModeration
 * @property {Object} Animals
 * @property {Object} Canvas
 * @property {Object} Facts
 * @property {Object} Fun
 * @property {Object} Reactions
 * @property {Object} Get
 */

module.exports = class BaseCommand {
	/**
	 * @param {String} name
	 * @param {String} category
	 * @param {Array} aliases
	 * @param {String} usage
	 * @param {String} description
	 * @param {String} accessibleby
	 * @param {Array} permissions
	 * @param {Array} SubCommands
	 * @param {Array} example
	 * @param {boolean} guildOnly
	 * @param {number} cooldown
	 * @param {boolean} owner
	 * @param {boolean} nsfw
	 * @param {Array} userPermissions
	 * @param {String} commandstatus
	 * @returns {Base}
	 * @example
	 *  module.exports = class HelloCommand extends BaseCommand {
	 * 	constructor() {
	 *		super("command", "bot", [], "", "", "", [], [], [], true, 3000, false, false, [], "Working")
	 * 	 }
	 * }
	 */
	constructor(
		name,
		category,
		aliases,
		usage,
		description,
		accessibleby,
		permissions,
		SubCommands,
		example,
		guildOnly,
		cooldown,
		owner,
		nsfw,
		userPermissions,
		commandstatus
	) {
		this.name = name;
		this.category = category;
		this.aliases = aliases;
		this.usage = `${this.name}${usage ? ` ${usage}` : ""}`;
		this.description = `${description ? description : "`None`"}`;
		this.accessibleby = `${accessibleby ? accessibleby : "`Members`"}`;
		this.permissions = permissions;
		this.SubCommands = SubCommands;
		this.example = example;
		this.guildOnly = `${guildOnly ? guildOnly : true}`;
		this.cooldown = `${cooldown ? cooldown : 3000}`;
		this.owner = `${owner ? owner : false}`;
		this.nsfw = `${nsfw ? nsfw : false}`;
		this.userPermissions = userPermissions;
		this.commandstatus = `${commandstatus ? commandstatus : "Working"}`;
		this.con = con.connection;
		this.Emojis = emojis;
		this.Colour = new Colour();
		this.Translator = new Translator();
		this.Utils = new Utils();
		this.Channels = new Channels();
		this.Settings = new Settings();
		this.Economy = new Economy();
		this.Xp = new Xp();
		this.ErrorEmbed = new ErrorEmbed();
		this.SuccessEmbed = new SuccessEmbed();
		this.Embed = new Embed();
		this.HelpEmbed = new HelpEmbed();
		this.GeneratingEmbed = new GeneratingEmbed();
		this.ImageEmbed = new ImageEmbed();
		this.Moderation = new Moderation();
		this.Animals = new Animals();
		this.Canvas = new Canvas();
		this.Facts = new Facts();
		this.Fun = new Fun();
		this.Reactions = new Reactions();
		this.Get = new Get().get;
	}
};
