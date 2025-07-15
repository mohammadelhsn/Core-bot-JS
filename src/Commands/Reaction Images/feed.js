const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const axios = require("axios");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseImageEmbed,
	getString,
	getLang,
} = require("../../utils/structures/functions");

module.exports = class FeedCommand extends BaseCommand {
	constructor() {
		super(
			"feed",
			"reaction images",
			[],
			"<mention>",
			"Feeds the mentioned user! :)",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["feed help` - Sends the help embed"],
			["feed @Tech!", "feed help"],
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
		const lang = await getLang(message.guild.id, this.connection);
		const self = this;
		// Colour function

		let user;
		const mention = message.mentions.users.first();

		if (mention) {
			user = mention;
		} else {
			user = args[0];
		}

		// Checking for a mention
		if (!user) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: You are missing the mention!```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
			// checking for "help" to return help embed
		} else if (user == args[0] && user.toLowerCase().includes("help")) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const generatingEmbed = await BaseGeneratingEmbed(client, message, self);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`Nekos fun API\``
			);

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/feed`);
				const body = res.data;

				const feedEmbed = BaseImageEmbed(client, message, self)
					.setTitle("Feed command")
					.setDescription(`<@${message.author.id}> has fed ${user}`)
					.setImage(body.image);

				m.delete();
				return message.channel.send(feedEmbed);
			} catch (e) {
				m.delete();
				console.log(e);

				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
				return message.channel.send(errEmbed);
			}
		}
	}
};
