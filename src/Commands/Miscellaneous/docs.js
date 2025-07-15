const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
const axios = require("axios");
const {
	BaseErrorEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");

module.exports = class DocsCommand extends BaseCommand {
	constructor() {
		super(
			"docs",
			"miscellaneous",
			["djs", "discord-js"],
			"<query>",
			"Search discord.js documentation",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["docs GuildMember"],
			false,
			3000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const query = args[0];

		if (!query) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription("```\nError details: Missing query```");
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
			query
		)}`;

		const docFetch = await axios.get(url);
		const embed = docFetch.data;

		if (!embed || embed.error) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription("```\nError details: Cannot find query```");
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (!message.guild) {
			return message.channel.send({ embed });
		}

		const msg = await message.channel.send({ embed });
		msg.react("🗑️");

		let react;

		try {
			react = await msg.awaitReactions(
				(reaction, user) =>
					reaction.emoji.name === "🗑️" && user.id === message.author.id,
				{ max: 1, time: 60000, errors: ["time"] }
			);
		} catch (error) {
			msg.reactions.removeAll();
		}

		if (react && react.first()) msg.delete();
	}
};
