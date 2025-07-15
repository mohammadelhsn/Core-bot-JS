const BaseCommand = require("../../utils/structures/BaseCommand");
const { BaseEmbed } = require("../../utils/structures/functions");

module.exports = class InviteCommand extends BaseCommand {
	constructor() {
		super(
			"invite",
			"bot",
			["inv"],
			"(help)",
			"Sends Core's invite.",
			"",
			[],
			["invite help` - Sends the help command"],
			["invite", "invite help"],
			true,
			500,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		const invite =
			"https://discord.com/oauth2/authorize?client_id=704034868547289089&permissions=4294438903&scope=bot%20applications.commands";

		if (args[0]) {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		} else {
			const embed = await this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: `Invite me!`,
				description: `Invite link: ${invite}`,
				link: invite,
			});
			return message.channel.send({ embed: embed });
		}
	}
};
