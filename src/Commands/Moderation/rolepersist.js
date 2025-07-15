const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class RolepersistCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"rolepersist",
			"moderation",
			[],
			"!rolepersist <add|remove> <role> <user> (time) (reason)",
			"Sticks the role to user, even if they leave",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			[
				"rolepersist add @Verified @Tech 1h",
				"rolepersist remove @verified @tech 1h",
			],
			true,
			1000,
			false,
			false,
			[],
			"wip"
		);
	}
	async run(client, message, args) {
		let todo;
		let role;
		let user;
		let reason;
	}
};
