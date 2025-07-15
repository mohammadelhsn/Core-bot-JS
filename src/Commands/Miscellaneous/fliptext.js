const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const axios = require("axios");
const {
	capitalize,
	getLang,
	getString,
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseEmbed,
	BaseGeneratingEmbed,
} = require("../../utils/structures/functions");

module.exports = class FliptextCommand extends BaseCommand {
	constructor() {
		super(
			"fliptext",
			"miscellaneous",
			[],
			"<text || help>",
			"txet nevig eht spilF",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["fliptext hello there"],
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

		let text;
		if (args[0] == "help") {
			return await BaseHelpEmbed(client, message, self);
		} else {
			text = args.join(" ");
		}

		if (!text) {
			const errEmbed = await BaseErrorEmbed(client, messsage, self);
			errEmbed.setDescription(
				`\`\`\`Error details: You are missing the text argument\`\`\``
			);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const gEmbed = await BaseGeneratingEmbed(client, message, self);
		gEmbed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
		);

		const m = await message.channel.send(gEmbed);

		try {
			const res = await axios.get(
				`https://no-api-key.com/api/v1/flip-text?text=${text}`
			);
			const body = res.data;

			const embed = BaseEmbed(client, message, self);
			embed.setDescription(
				`${capitalize(getString(lang, "provided_by"))}: \`No-api-key\``
			);
			embed.addField("Flipped text", `\`${body.message}\``);
			m.delete();
			return message.channel.send(embed);
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
};
