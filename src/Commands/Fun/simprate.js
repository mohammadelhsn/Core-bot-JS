const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	capitalize,
	getLang,
	getString,
	BaseEmbed,
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseGeneratingEmbed,
} = require("../../utils/structures/functions");

module.exports = class SimprateCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"simprate",
			"fun",
			[],
			"(mention)",
			"Gives you a simp rating",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["simprate help` - Sends the help embed"],
			["simprate", "simprate @Tech!", "simprate help"],
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
		const sexyrate = Math.floor(Math.random() * 100);

		if (!args[0]) {
			const sexyRateEmbed = BaseEmbed(client, message, this)
				.setTitle("Simprate command")
				.setDescription(
					`:heart: Simp rate :heart: I rate you a \`${sexyrate}\` out of 100 on the simp rate scale!`
				);
			return message.channel.send(sexyRateEmbed);
		} else {
			let mention = message.mentions.users.first();
			let toR8;
			if (mention) {
				toR8 = mention;
			} else {
				toR8 = args[0];
			}
			if (toR8 == args[0]) {
				if (toR8.toLowerCase().includes("help")) {
					return await BaseHelpEmbed(client, message, self);
				} else {
					const rateEmbed = BaseEmbed(client, message, this)
						.setTitle("Simprate command")
						.setDescription(
							`:heart: Simp rate :heart: I rate ${toR8} a \`${sexyrate}\` out of 100 on the simp rate scale!`
						);
					return message.channel.send(rateEmbed);
				}
			}
			if (toR8 == mention) {
				const rateEmbed = BaseEmbed(client, message, this)
					.setTitle("Simprate command")
					.setDescription(
						`:heart: Simp rate :heart: I rate ${toR8} a \`${sexyrate}\` out of 100 on the simp rate scale!`
					);
				return message.channel.send(rateEmbed);
			}
		}
	}
};
