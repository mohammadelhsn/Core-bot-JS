const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const axios = require("axios");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseImageEmbed,
	getLang,
	getString,
	capitalize,
} = require("../../utils/structures/functions");
const fetch = require("node-fetch");

module.exports = class LickCommand extends BaseCommand {
	constructor() {
		super(
			"lick",
			"reaction images",
			[],
			"(help)",
			"Licks the mentioned user",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["lick help` - Sends the help embed"],
			["lick", "lick help"],
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

		if (!user) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				"```Error details: You are missing a required argument.```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		} else if (user == args[0] && user.toLowerCase().includes("help")) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`Nekos fun API\``
			);

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/lick`);
				const body = res.data;

				const cuddleEmbed = BaseImageEmbed(client, message, this)
					.setTitle("Lick command")
					.setDescription(`<@${message.author.id}> has licked ${user}! 😋😋😋`)
					.setImage(body.image);

				m.delete();
				return message.channel.send(cuddleEmbed);
			} catch (e) {
				m.delete();
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
				return message.chanel.send(errorEmbed);
			}
		}
	}
};
