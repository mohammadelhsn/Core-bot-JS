const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	fetchSuggestions,
} = require("../../utils/structures/functions");
const { error_emoji, success_emoji } = require("../../../emojis.json");

module.exports = class SuggestCommand extends BaseCommand {
	constructor() {
		super(
			"suggest",
			"server utilities",
			["sug"],
			"(help)",
			"Sends a suggestion to a suggestion channel (must be setup prior to the use of the command!)",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["suggest help` - Sends help embed"],
			["suggest add music channel", "suggest help"],
			true,
			2000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const emoji_error = client.emojis.cache.find(
			(e) => e.id == "707186665013116969"
		);
		const emoji_success = client.emojis.cache.find(
			(e) => e.id == "707186665210511423"
		);

		const suggestionsChannel = await fetchSuggestions(
			this.connection,
			message.guild.id
		);

		if (suggestionsChannel == "null") {
			const noChannelEmbed = await BaseErrorEmbed(client, message, this);
			noChannelEmbed.setDescription(
				`\`\`\`Error details: Suggestions are currently disabled. Enable them if you want this to work.\`\`\``
			);
			const msg = await message.channel.send(noChannelEmbed);
			return msg.delete({ timeout: 10000 });
		} else if (args[0].toLowerCase() === "help") {
			return await BaseHelpEmbed(client, message, this);
		} else {
			const suggestion = args.join(" ");
			if (!suggestion) {
				const missingArgument = await BaseErrorEmbed(client, message, this);
				missingArgument.setDescription(
					"```Error details: You are missing the suggestion!```"
				);
				return message.channel.send(missingArgument);
			} else {
				const suggestionEmbed = BaseEmbed(client, message, this)
					.setTitle(`New suggestion!`)
					.setDescription(`Please react to ${success_emoji} or ${error_emoji}`)
					.addField("Suggestion", `\`${suggestion}\``)
					.addField("Author", `<@${message.author.id}>`)
					.addField("Date", `\`${message.createdAt.toLocaleString()}\``)
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
				client.channels.cache
					.get(`${suggestionsChannel}`)
					.send(suggestionEmbed)
					.then(async (msg) => {
						await msg.react(emoji_success);
						await msg.react(emoji_error);
					});
			}
		}
	}
};
