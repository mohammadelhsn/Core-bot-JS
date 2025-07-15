const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const { colour } = require("../../utils/structures/functions");

module.exports = class MessageDeleteBulkEvent extends (
	BaseEvent
) {
	constructor() {
		super("messageDeleteBulk");
		this.connection = StateManager.connection;
	}
	async run(client, messages) {}
};
