const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseImageEmbed,
	getLang,
	getString,
} = require("../../utils/structures/functions");
const fetch = require("node-fetch");

module.exports = class FacepalmCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"facepalm",
			"reaction images",
			[],
			"",
			"*facepalm*",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["facepalm help` - Sends the help embed"],
			["facepalm", "facepalm help"],
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
		// https://some-random-api.ml/animu/face-palm

		if (args[0]) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
			generatingEmbed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`some-random-api\``
			);

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await axios.get(
					`https://some-random-api.ml/animu/face-palm`
				);
				const body = res.data;

				const imageEmbed = BaseImageEmbed(client, message, this)
					.setTitle(`Facepalm command`)
					.setDescription(`<@${message.author.id}> facepalms 🤦‍♂️🤦‍♀️`)
					.setImage(body.link);

				m.delete();
				return message.channel.send(imageEmbed);
			} catch (e) {
				m.delete();
				console.log(e);

				const errEmbed = await BaseErrorEmbed(client, message, this);
				errEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
				return message.channel.send(errEmbed);
			}
		}
	}
};
