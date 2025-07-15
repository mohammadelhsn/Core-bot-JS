const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const pagination = require("discord.js-pagination");
const { EmojiAPI } = require("emoji-api");
const emoji = new EmojiAPI();
const {
	BaseErrorEmbed,
	BaseImageEmbed,
} = require("../../utils/structures/functions");

module.exports = class EmojiInfoCommand extends BaseCommand {
	constructor() {
		super(
			"emojisearch",
			"server utilities",
			[],
			"<emoji query>",
			"Search information about default discord emojis.",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["emojisearch 🥰"],
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
		try {
			const res = await emoji.get(`${args[0]}`);

			if (res.emoji == null) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```Error details: Cannot find this emoji```"
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			const embeds = [];
			res.images.forEach((vendor) => {
				embeds.push(
					BaseImageEmbed(client, message, self)
						.setTitle(res.name)
						.setDescription(`\`${res.description}\``)
						.addField(
							"Shortcodes:",
							`${res.shortCodes.map((e) => `\`${e}\``).join(", ")}`
						)
						.addField("Vendor", `${vendor.vendor}`)
						.setImage(vendor.url)
				);
			});
			return pagination(message, embeds, ["⬅️", "➡️"], 600000);
		} catch (e) {
			console.log(e);

			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: An unexpected error has occurred```"
			);
			return message.channel.send(errorEmbed);
		}
	}
};
