const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseImageEmbed,
	getString,
	getLang,
	capitalize,
} = require("../../utils/structures/functions");

module.exports = class TruthCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"truth",
			"fun",
			[],
			"<truth>",
			"Makes whatever you say the truth!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["truth help`"],
			["truth @Tech! is the coolest :sunglasses:", "truth help"],
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
		const truth = args[0];

		if (truth.toLowerCase() === "help") {
			return await BaseHelpEmbed(client, message, self);
		}

		const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
		generatingEmbed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`Alexflipnote API\``
		);

		const m = await message.channel.send(generatingEmbed);

		if (!truth) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`\nError details: Missing argument\`\`\``
			);
			return message.channel.send(errorEmbed);
		} else {
			const truthEmbed = BaseImageEmbed(client, message, this)
				.setTitle("Truth command")
				.setDescription(
					`${capitalize(getString(lang, "provided_by"))}: \`Alexflip note API\``
				)
				.setImage(
					`https://api.alexflipnote.dev/scroll?text=` + args.join("%20")
				);

			m.delete();
			return message.channel.send(truthEmbed);
		}
	}
};
