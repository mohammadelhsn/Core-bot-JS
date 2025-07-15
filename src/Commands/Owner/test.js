const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	getCaseNumber,
	insertModeration,
	fetchModlog,
	fetchPublicModlog,
	fetchModeration,
} = require("../../utils/structures/functions");

module.exports = class TestCommand extends BaseCommand {
	constructor() {
		super(
			"test",
			"owner",
			[],
			"",
			"Owner only testing",
			"",
			[],
			[],
			[],
			true,
			3000,
			true,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;

		/* 		const caseNumber = await getCaseNumber(message.guild.id, this.connection);
		const modlog = await fetchModlog(this.connection, message.guild.id);
		const publicmodlog = await fetchPublicModlog(
			this.connection,
			message.guild.id
		);

		let id;
		if (modlog == null) {
			id = null;
		} else {
			let m = await client.channels.cache.get(modlog).send("hello");
			id = m.id;
		}

		let pid;
		if (publicmodlog == null) {
			pid = null;
		} else {
			let p = await client.channels.cache.get(publicmodlog).send("hello");
			pid = p.id;
		}

		await insertModeration(
			message.guild.id,
			"ban",
			caseNumber,
			message.author.id,
			this.connection,
			{ modlog: id, publicmodlog: pid, user: message.author.id, reason: null }
		); */

		await fetchModeration(message.guild.id, "14", this.connection);
	}
};
