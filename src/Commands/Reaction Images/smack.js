const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const fetch = require("node-fetch");
const axios = require("axios");
const {
	BaseImageEmbed,
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseGeneratingEmbed,
	getString,
	getLang,
	capitalize,
} = require("../../utils/structures/functions");

module.exports = class SmackCommand extends BaseCommand {
	constructor() {
		super(
			"smack",
			"reaction images",
			[],
			"<mention>",
			"Spanks the mentioned user",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["smack help` - Sends the help embed"],
			["smack @Tech!", "smack help"],
			true,
			3000,
			false,
			true,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const lang = await getLang(message.guild.id, this.connection);
		const self = this;
		let user;
		const mention = message.mentions.users.first();

		if (!mention) {
			user = args[0];
		} else {
			user = mention;
		}
		if (!user) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: You are missing the mention!\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		} else if (user == args[0] && user.toLowerCase().includes("help")) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const generatingEmbed = await BaseGeneratingEmbed(client, message, self);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`Nekos fun API\``
			);

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/spank`);
				const body = res.data;

				const pokeEmbed = BaseImageEmbed(client, message, self)
					.setTitle("Spank command")
					.setDescription(`<@${message.author.id}> has spanked ${user}!`)
					.setImage(body.image);

				m.delete();
				return message.channel.send(pokeEmbed);
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
