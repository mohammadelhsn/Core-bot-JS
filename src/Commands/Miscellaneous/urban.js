const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const { stripIndents } = require("common-tags");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseImageEmbed,
} = require("../../utils/structures/functions");
const urban = require("urban");

module.exports = class UrbanCommand extends BaseCommand {
	constructor() {
		super(
			"urban",
			"miscellaneous",
			["usearch", "urb"],
			"<search|random> (query)",
			"Defines the mentioned word or gives a random word",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["urban search tbh", "urban random"],
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
		const image =
			"http://cdn.marketplaceimages.windowsphone.com/v8/images/5c942bfe-6c90-45b0-8cd7-1f2129c6e319?imageType=ws_icon_medium";
		const search = args[1] ? urban(args.slice(1).join("%20")) : urban.random();

		if (!args[0] || !["search", "random"].toLowerCase().includes(args[0])) {
			return await BaseHelpEmbed(client, message, self);
		}
		try {
			search.first(async (res) => {
				if (!res) {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						`\`\`\`\nError details: Nothing could be found for ${search}\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}
				let {
					word,
					definition,
					example,
					thumbs_up,
					thumbs_down,
					permalink,
					author,
				} = res;

				const embed = BaseImageEmbed(client, message, this)
					.setAuthor(`Urban Dictionary | ${word}`, image)
					.setThumbnail(image)
					.setDescription(
						stripIndents`**Defintion:** ${definition || "No definition"}
                        **Example:** ${example || "No Example"}
                        **Upvote:** ${thumbs_up || 0}
                        **Downvote:** ${thumbs_down || 0}
                        **Link:** [link to ${word}](${
							permalink || "https://www.urbandictionary.com/"
						})`
					)
					.setFooter(`Written by ${author || "unknown"}`);
				return message.channel.send(embed);
			});
		} catch (e) {
			console.log(e);

			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription("```\nError details: Error unknown```");
			return message.channel.send(errorEmbed);
		}
	}
};
