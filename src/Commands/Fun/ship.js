const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
} = require("../../utils/structures/functions");

module.exports = class ShipCommand extends BaseCommand {
	constructor() {
		super(
			"ship",
			"fun",
			[],
			"<mention1> <mention2>",
			"Gives you a shipping rate on the mentioned users!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["ship help` - Sends the help embed"],
			["ship @Tech!", "ship @Core @Tech!", "ship help"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
		const mention1 =
			args[0] ||
			message.guild.members.cache.find((m) => m.user.tag === args[0]);
		let mention2 =
			args.slice(1).join(" ") ||
			message.guild.members.cache.find((m) => m.user.tag === args[1]);

		if (!mention1) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription("```\nError: The first mention is missing!```");
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (mention1 === "help") {
			return await BaseHelpEmbed(client, message, self);
		}
		if (!mention2) mention2 = message.author.username;

		const ship = Math.floor(Math.random() * 100) + 1;

		if (ship <= 50) {
			const badmatch = BaseEmbed(client, message, this)
				.setTitle(`${mention1} and ${mention2} dont ship well. Oof`)
				.setDescription(`:broken_heart: ${ship}% :broken_heart:`);
			return message.channel.send(badmatch);
		} else if (ship === 100) {
			const perfectMatch = BaseEmbed(client, message, this)
				.setTitle(
					`${mention1} and ${mention2} are meant for each other! :eyes:`
				)
				.setDescription(`:heart_eyes: ${ship}% :heart_eyes:`);
			return message.channel.send(perfectMatch);
		} else {
			const match = BaseEmbed(client, message, this)
				.setTitle(`${mention1} and ${mention2} match well`)
				.setDescription(`:heart: ${ship}% :heart:`);
			return message.channel.send(match);
		}
	}
};
