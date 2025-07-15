const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseImageEmbed,
} = require("../../utils/structures/functions");

module.exports = class SnipeCommand extends BaseCommand {
	constructor() {
		super(
			"snipe",
			"miscellaneous",
			[],
			"",
			"Get the last message sent in the channel that was deleted",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["snipe"],
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
		if (!client.snipes) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: No snipes for this channel```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		const snipe = client.snipes.get(message.channel.id);

		if (!snipe) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: No snipes for this channel```"
			);
			return message.channel.send(errorEmbed);
		}

		// help

		const snipeEmbed = BaseImageEmbed(client, message, self)
			.setTitle("Message sniped")
			.setDescription(
				`~~Did you really think you'd get away with that <@${snipe.user}>?~~`
			)
			.addField(
				`${snipe.msg == 0 ? "\u200B" : "Message"}`,
				`${snipe.msg == 0 ? "\u200B" : `${snipe.msg}`}`
			)
			.addField(
				`${snipe.image ? "Attachment URL" : "\u200B"}`,
				`${
					snipe.image
						? `Proxy URL: [${snipe.fileName}](${snipe.image}) || Backup: [${snipe.fileName}](${snipe.url})`
						: "\u200B"
				}`
			)
			.setThumbnail(snipe.iconURL)
			.setImage(snipe.image);
		return message.channel.send(snipeEmbed);
	}
};
