require("dotenv").config();
const BaseCommand = require("../../Utils/Structures/BaseCommand");
const StateManager = require("../../Utils/StateManager");
const request = require("node-superfetch");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseImageEmbed,
} = require("../../Utils/Structures/Functions");

module.exports = class GoogleCommand extends BaseCommand {
	constructor() {
		super(
			"google",
			"miscellaneous",
			["gsearch", "g"],
			"(query)",
			"Does a google search on the given query",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["google help` - Sends the help embed"],
			["google discord.js"],
			true,
			3000,
			false,
			false,
			""
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
		const key = process.env.GOOGLE_KEY;
		const csx = process.env.GOOGLE_CSX;
		const query = args.join("%20");
		let result;

		if (query.toLowerCase() === "help") {
			return await BaseHelpEmbed(client, message, self);
		}

		if (!query) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				"```\nError details: You are missing the required query```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const href = await search(query);

		if (!href) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription("```\nError details: Unknown search```");
			return message.channel.send(errorEmbed);
		}

		const embed = BaseImageEmbed(client, message, this)
			.setTitle(href.title)
			.setDescription(href.snippet)
			.setImage(
				href.pagemap.cse_thumbnail ? href.pagemap.cse_thumbnail[0].src : null
			)
			.setURL(href.link);
		return message.channel.send(embed);

		async function search(query) {
			const { body } = await request
				.get("https://www.googleapis.com/customsearch/v1")
				.query({
					key: key,
					cx: csx,
					safe: "off",
					q: query,
				});

			if (!body.items) return null;
			return body.items[0];
		}
	}
};
