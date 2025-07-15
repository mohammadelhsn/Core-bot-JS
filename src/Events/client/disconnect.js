const BaseEvent = require("../../utils/structures/BaseEvent");
const StateManager = require("../../utils/StateManager");

module.exports = class DisconnectEvent extends (
	BaseEvent
) {
	constructor() {
		super("disconnect");
		this.connection = StateManager.connection;
	}
	async run(client) {}
};
