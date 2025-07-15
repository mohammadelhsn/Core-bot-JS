const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");
const nl = require("nekos.life");
const neko = new nl();

// Enter command name and change class name to command name {command}
module.exports = class SexyrateCommand extends BaseCommand {
	constructor() {
		super(
			"sexyrate",
			"fun",
			[],
			"(mention)",
			"Gives a sexy rating ;)",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["sexyrate help` - Sends the help embed"],
			["sexyrate", "sexyrate @Tech!", "sexyrate help"],
			true,
			3000,
			false,
			false,
			[],
			""
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
		const sexyrate = Math.floor(Math.random() * 100);

		if (!args[0]) {
			const sexyRateEmbed = BaseEmbed(client, message, this)
				.setTitle("Sexyrate command")
				.setDescription(
					`:heart: Sexy rate :heart: I rate you a \`${sexyrate}\` out of 100 on the sexy rate scale!`
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
						.setTitle("Sexyrate command")
						.setDescription(
							`:heart: Sexy rate :heart: I rate ${toR8} a \`${sexyrate}\` out of 100 on the sexy rate scale!`
						);
					return message.channel.send(rateEmbed);
				}
			}
			if (toR8 == mention) {
				const rateEmbed = BaseEmbed(client, message, this)
					.setTitle("Sexyrate command")
					.setDescription(
						`:heart: Sexy rate :heart: I rate ${toR8} a \`${sexyrate}\` out of 100 on the sexy rate scale!`
					);
				return message.channel.send(rateEmbed);
			}
		}
	}
};
