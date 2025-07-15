const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class RoleCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"role",
			"moderation",
			[],
			"!role <add|remove> <role> <user> (reason)",
			"Adds/removes the mentioned role",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["role add @Verified @Tech!", "role remove @Verified Tech!"],
			true,
			1000,
			false,
			false,
			[],
			"wip"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		let todo;
		let role;
		let user;
		let reason;
	}
};
