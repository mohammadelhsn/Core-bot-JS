const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const axios = require("axios");
const {
	capitalize,
	getLang,
	getString,
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseEmbed,
} = require("../../utils/structures/functions");

module.exports = class CoinflipCommand extends BaseCommand {
	constructor() {
		super(
			"coinflip",
			"fun",
			[],
			"coinflip <heads || tails>",
			"Flip a coin to see what it lands on",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["coinflip help` - Sends the help embed"],
			["coinflip heads", "coinflip tails", "coinflip help"],
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
		const lang = await getLang(message.guild.id, this.connection);
		const self = this;

		const choice = args.join(" ").toLowerCase();
		if (!choice) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: Missing a required argument\`\`\``
			);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (choice == "help") {
			return await BaseHelpEmbed(client, message, self);
		} else if ((choice !== "heads") & (choice !== "tails")) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(`\`\`\`Error details: Invalid choice!\`\`\``);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const res = await axios.get(`https://no-api-key.com/api/v1/coin-flip`);
		const body = res.data;

		function findWinner(uChoice, botChoice) {
			if (uChoice !== botChoice) {
				return `The correct choice was: **\`${botChoice}\`**`;
			} else {
				return `You got it right! Congratulations!!! :tada:`;
			}
		}

		const embed = BaseEmbed(client, message, self);
		embed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
		);
		embed.addField("Coin", `${findWinner(choice, body.coin)}`);
		embed.setThumbnail(body.gif);
		return message.channel.send(embed);
	}
};
