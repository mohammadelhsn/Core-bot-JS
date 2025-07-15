const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class botSuggestion extends BaseCommand {
	constructor() {
		super(
			"botsuggest",
			"bot",
			["bsuggest", "bsugg", "bs"],
			"<suggestion>",
			"Sends a suggestion to the owner of the bot",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["botsuggest music"],
			true,
			30000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		const emoji_success = client.emojis.cache.find(
			(e) => e.id == this.Emojis.success_emoji
		);
		const emoji_error = client.emojis.cache.find(
			(e) => e.id == this.Emojis.error_emoji
		);

		const suggestion = args.slice(0).join(" ");
		if (!suggestion) {
			const embed = await this.ErrorEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				error_message:
					"You must mention a suggestion for this command to work!",
			});
			const msg = await message.channel.send(embed);
			return msg.delete({ timeout: 10000 });
		} else if (suggestion === "help") {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		} else {
			const thanksEmbed = await this.SuccessEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				success_message: `Your suggestion will be reviewed by the bot owner!\n\`Please note if it's a troll, you will be blacklisted from using the bot\``,
			});
			try {
				message.author.send(thanksEmbed);
			} catch (e) {
				console.log(e);
			}

			const suggestionEmbed = await this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				title: `New bot suggestion from **${message.author.username}#${message.author.discriminator}** (${message.author.id})`,
				description: `Suggestions: \`${suggestion}\``,
			});
			const channel = await client.channels.cache.get("820148880963928094");
			channel.send({ embed: suggestionEmbed }).then(async (msg) => {
				await msg.react(emoji_success);
				await msg.react(emoji_error);
			});
		}
	}
};
