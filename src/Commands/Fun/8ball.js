const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseEmbed,
} = require("../../utils/structures/functions");
const nl = require("nekos.life");
const neko = new nl();

module.exports = class EightBallCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"8ball",
			"fun",
			[],
			"",
			"Ask the magical 8ball a question!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["8ball help` - Sends the help command"],
			["8ball", "8ball help"],
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
		const question = args.join(" ");

		if (!question) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details Missing a required argument```"
			);
			return message.channel.send(errorEmbed);
		}
		if (question) {
			if (args[0] == "help") {
				return await BaseHelpEmbed(client, message, self);
			}
			try {
				const res = await neko.sfw["8Ball"]({ text: question });
				const embed = BaseEmbed(client, message, self)
					.setDescription(`Response: ${res.response}`)
					.setThumbnail(res.url);
				return message.channel.send(embed);
			} catch (e) {
				console.log(e);

				const embed = await BaseErrorEmbed(client, message, self);
				embed.setDescription(
					"```Error details: An unexpected error has occurred```"
				);
				return message.channel.send(embed);
			}
		}
	}
};
