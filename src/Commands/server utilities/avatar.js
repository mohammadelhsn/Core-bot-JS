const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseHelpEmbed,
	BaseImageEmbed,
} = require("../../utils/structures/functions");

module.exports = class AvatarCommand extends BaseCommand {
	constructor() {
		super(
			"avatar",
			"server utilities",
			["av", "ava"],
			"(mention)",
			"Shows the profile picture of the mentioned person or yourself!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["avatar help` - Sends the help embed"],
			["avatar", "avatar @Core"],
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
		const user = message.mentions.users.first();

		if (user) {
			const member = message.mentions.users.first();

			const embed = BaseImageEmbed(client, message, this)
				.setTitle(`${member.username}'s avatar`)
				.setImage(member.avatarURL({ dynamic: true }));
			return message.channel.send(embed);
		} else if (args[0].toLowerCase() === "help") {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const member = message.author;

			const embed = BaseImageEmbed(client, message, this)
				.setTitle(`${member.username}'s avatar`)
				.setImage(member.avatarURL({ dynamic: true }));
			return message.channel.send(embed);
		}
	}
};
