const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
} = require("../../utils/structures/functions");

// Enter command name and change class name to command name {command}
module.exports = class RpsCommand extends BaseCommand {
	constructor() {
		super(
			"rps",
			"fun",
			[],
			"<rock||paper||scissors>",
			"Play a game of rock paper or scissors",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["rps help` - Sends the help embed"],
			["rps paper", "rps rock", "rps scissors", "rps help"],
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
		let rps = [
			"**:moyai: rock**",
			"**:pencil: paper**",
			"**:scissors: scissors**",
		];
		function random() {
			return `${rps[Math.floor(Math.random() * rps.length)]}!`;
		}
		let choice = args.join(" ").toLowerCase();
		if (!choice) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription("```Error details: Please make a choice!```");
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (choice.includes("help")) {
			return await BaseHelpEmbed(client, message, this);
		} else if (
			choice !== "rock" &&
			choice !== "paper" &&
			choice !== "scissors"
		) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: Please pick a valid choice: rock, paper or scissors\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		const rpsEmbed = BaseEmbed(client, message, this)
			.setTitle("Rock paper or scissors!")
			.setDescription(`${random()}`);
		return message.channel.send(rpsEmbed);
	}
};
