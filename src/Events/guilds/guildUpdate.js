const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const { colour } = require("../../utils/structures/functions");

module.exports = class GuildUpdateEvent extends (
	BaseEvent
) {
	constructor() {
		super("guildUpdate");
		this.connection = StateManager.connection;
	}
	async run(client, oldGuild, newGuild) {}
};
