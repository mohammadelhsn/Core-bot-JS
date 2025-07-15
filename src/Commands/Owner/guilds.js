const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
} = require("../../utils/structures/functions");

module.exports = class GuildsCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"guilds",
			"owner",
			[],
			"",
			"View all guilds the bot is in.",
			"",
			[],
			[],
			[],
			true,
			1000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		const embed = BaseEmbed(client, message, this);
		client.guilds.cache.forEach((g) => {
			embed.addField(`Guild \`${g.name}\` | \`${g.id}\``, `<@${g.ownerID}>`);
		});
		return message.channel.send(embed);
	}
};
