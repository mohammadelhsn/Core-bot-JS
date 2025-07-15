const BaseCommand = require("../../utils/structures/BaseCommand");
const request = require("node-superfetch");
const {
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseImageEmbed,
} = require("../../utils/structures/functions");

module.exports = class PrequelMemesCommand extends BaseCommand {
	constructor() {
		super(
			"prequelmemes",
			"memes",
			[],
			"",
			"Generates a prequel meme",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["prequelmemes"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		const self = this;
		if (args[0]) {
			if (args[0].toLowerCase().includes("help")) {
				return await BaseHelpEmbed(client, message, self);
			}
		} else {
			const { body } = await request
				.get("https://www.reddit.com/r/prequelmemes.json?sort=top&t=week")
				.query({
					limit: 800,
				});
			const allowed = message.channel.nsfw
				? body.data.children
				: body.data.children.filter((post) => !post.data.over_18);
			if (!allowed.length) {
				const errorEmbed = BaseErrorEmbed(client, message, this).setDescription(
					`\`\`\`\nError details: Cannot find any images\`\`\``
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
