const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const { BaseErrorEmbed } = require("../../utils/structures/functions");

module.exports = class LeaveCommand extends BaseCommand {
	constructor() {
		super(
			"quit",
			"owner",
			["leaveg"],
			"(guildId)",
			"Forces the bot to leave the guild",
			"Owner",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["quit", "quit 3788387893737378"],
			true,
			1000,
			true,
			false,
			[],
			"Working"
		);
	}

	async run(client, message, args) {
		const reason = args.slice(1).join(" ");
		let id = args[0];

		if (!reason) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				"```Error details: This is a required argument```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (!id) id = message.guild.id;

		return message.guild.leave(id);
	}
};
