const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseErrorEmbed,
	BaseImageEmbed,
	BaseHelpEmbed,
	capitalize,
} = require("../../utils/structures/functions");
const moment = require("moment");
const { success_emoji, error_emoji } = require("../../../emojis.json");

module.exports = class EmojiSearchCommand extends BaseCommand {
	constructor() {
		super(
			"emojiinfo",
			"miscellaneous",
			[],
			"",
			"Get the information on an emoji in the guild",
			"",
			[],
			[],
			[],
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
		const emote = args[0];
		if (!emote) {
			const errEmbed = await BaseErrorEmbed(client, message, this);
			errEmbed.setDescription(
				`\`\`\`Error details: Missing a required emoji argument\`\`\``
			);
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}
		if (emote == "help") {
			return await BaseHelpEmbed(client, message, this);
		}
		const regex = emote.replace(/^<a?:\w+:(\d+)>$/, "$1");
		const emoji = message.guild.emojis.cache.find(
			(emj) => emj.name == emote || emj.id == regex
		);
		if (!emoji) {
			const errEmbed = await BaseErrorEmbed(client, message, this);
			errEmbed.setDescription(
				`\`\`\`Error details: Cannot find this emoji in this guild\`\`\``
			);
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}

		const authorFetch = await emoji.fetchAuthor();

		const embed = BaseEmbed(client, message, this)
			.setDescription(`\`${capitalize(emoji.name)}\` information`)
			.setThumbnail(emoji.url)
			.addField("ID", `\`${emoji.id}\``)
			.addField("Author", `<@${authorFetch.id}>`)
			.addField(
				"Time created",
				`${moment(emoji.createdTimestamp).format("LT")} ${moment(
					emoji.createdTimestamp
				).format("LL")} ${moment(emoji.createdTimestamp).fromNow()}`
			)
			.addField(
				"Accessible by",
				`${
					emoji.roles.cache.map((role) => `\`${role.name}\``).join(", ") ||
					"`Everyone`"
				}`
			)
			.addField(
				"Requires colons",
				`${emoji.requiresColons ? `${success_emoji}` : `${error_emoji}`}`
			)
			.addField(
				"Deleteable",
				`${emoji.deletable ? `${success_emoji}` : `${error_emoji}`}`
			)
			.addField(
				"Animated",
				`${emoji.animated ? `${success_emoji}` : `${error_emoji}`}`
			)
			.addField(
				"Managed",
				`${emoji.managed ? `${success_emoji}` : `${error_emoji}`}`
			);
		return message.channel.send(embed);
	}
};
