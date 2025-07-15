const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const request = require("node-superfetch");
const {
	BaseHelpEmbed,
	BaseImageEmbed,
	BaseErrorEmbed,
} = require("../../utils/structures/functions");

module.exports = class SequelMemesCommand extends BaseCommand {
	constructor() {
		super(
			"sequelmemes",
			"memes",
			[],
			"",
			"Sends a sequel meme",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["sequelmemes"],
			true,
			3000,
			false,
			false,
			"",
			"done"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
		if (args[0]) {
			if (args[0].toLowerCase().includes("help")) {
				return await BaseHelpEmbed(client, message, self);
			}
		} else {
			const { body } = await request
				.get("https://www.reddit.com/r/sequelmemes.json?sort=top&t=week")
				.query({
					limit: 800,
				});
			const allowed = message.channel.nsfw
				? body.data.children
				: body.data.children.filter((post) => !post.data.over_18);
			if (!allowed.length) {
				const errorEmbed = BaseErrorEmbed(client, message, this).setDescription(
					`\`\`\`Error details: I cannot find any images\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
			const randomnumber = Math.floor(Math.random() * allowed.length);

			const embed = BaseImageEmbed(client, message, this)
				.setTitle(allowed[randomnumber].data.title)
				.setDescription("Posted by: " + allowed[randomnumber].data.author)
				.setImage(allowed[randomnumber].data.url);
			return message.channel.send(embed);
		}
	}
};
