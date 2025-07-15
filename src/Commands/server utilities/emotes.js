const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const request = require("node-superfetch");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseImageEmbed,
} = require("../../utils/structures/functions");

module.exports = class EmotesCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"emotes",
			"server utilities",
			[],
			"",
			"Sends all emotes in the guild.",
			"",
			[],
			[],
			[],
			true,
			3000,
			false,
			false,
			[],
			"WIP"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
		const a_emojis = message.guild.emojis.cache.filter(
			(e) => e.animated == true
		);
		const emotes = message.guild.emojis.cache.filter(
			(e) => e.animated !== true
		);
		const animated = a_emojis
			.map((e) => `<${e.animated ? "a" : ""}${`:${e.name}:`}${`${e.id}`}>`)
			.join(" ");
		const n_animated = emotes
			.map((e) => `<${e.animated ? "a" : ""}${`:${e.name}:`}${`${e.id}`}>`)
			.join(" ");

		const embed = BaseEmbed(client, message, self).setDescription(
			`${n_animated}`
		);
		const embed2 = BaseEmbed(client, message, self).setDescription(
			`${animated}`
		);
		message.channel.send(embed);
		return message.channel.send(embed2);
	}
};
