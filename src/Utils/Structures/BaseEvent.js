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

module.exports = class BaseEvent {
	/**
	 * The Base event object
	 * @param {String} name
	 * @returns {object} Base event
	 * @example
	 * module.exports = class ReadyEvent extends BaseEvent {
	 * 	 constructor() {
	 * 		super("ready")
	 * 	 }
	 * }
	 */
	constructor(name) {
		this.name = name;
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
