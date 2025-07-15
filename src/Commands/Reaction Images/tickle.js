const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
const axios = require("axios");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseImageEmbed,
	getString,
	getLang,
	capitalize,
} = require("../../utils/structures/functions");

module.exports = class TickleCommand extends BaseCommand {
	constructor() {
		super(
			"tickle",
			"reaction images",
			[],
			"<mention>",
			"Tickles the mentioned user",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["tickle help` - Sends the help embed"],
			["tickle @Tech!", "tickle help"],
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
		const mention = message.mentions.users.first();
		let user;

		if (mention) {
			user = mention;
		} else {
			user = args[0];
		}

		if (user == args[0] && user.toLowerCase().includes("help")) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			if (!user) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: You are missing the mention! Please use !tickle help for more help with the usage.\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			const generatingEmbed = await BaseGeneratingEmbed(client, message, self);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`Nekos fun API\``
			);

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/tickle`);
				const body = res.data;

				if (!body) {
					m.delete();

					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription("```Error details: Invalid API response```");
					const msg = await message.channel.send(errEmbed);
					return msg.delete({ timeout: 10000 });
				}

				const tickleEmbed = BaseImageEmbed(client, message, self)
					.setTitle("Tickle command")
					.setDescription(`<@${message.author.id}> has tickled ${user}!`)
					.setImage(body.image);

				m.delete();
				return message.channel.send(tickleEmbed);
			} catch (e) {
				m.delete();
				console.log(e);

				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "provided_by")}\`\`\``
				);
				return message.channel.send(errEmbed);
			}
		}
	}
};
