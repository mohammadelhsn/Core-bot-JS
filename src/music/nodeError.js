const BaseEvent = require("../utils/structures/BaseEvent");

module.exports = class NodeErrorEvent extends BaseEvent {
	constructor() {
		super("nodeError");
	}
	async run(client, node, error) {
		console.log(
			`Node ${node.options.identfier} had an error.\n${error.message}`
		);
	}
};
