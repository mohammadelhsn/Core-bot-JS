const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const axios = require("axios");
const {
	capitalize,
	getLang,
	getString,
	BaseErrorEmbed,
	BaseEmbed,
	BaseGeneratingEmbed,
} = require("../../utils/structures/functions");

module.exports = class BinaryCommand extends BaseCommand {
	constructor() {
		super(
			"binary",
			"miscellaneous",
			[],
			"<to || from> <text>",
			"Translates given text to or from binary",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			[
				"binary to hello there",
				"binary from 01101000 01100101 01101100 01101100 01101111 00100000 01110100 01101000 01100101 01110010 01100101",
			],
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

		const gEmbed = await BaseGeneratingEmbed(client, message, self);
		gEmbed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
		);

		const m = await message.channel.send(gEmbed);

		const todo = args[0];
		const text = args.slice(1).join("%20");

		if (todo == "to") {
			try {
				const res = await axios.get(
					`https://no-api-key.com/api/v1/binary?text=${text}`
				);
				const body = res.data;

				const embed = BaseEmbed(client, message, self);
				embed.setDescription(
					`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
				);
				embed.addField("Text", `\`${body.binary}\``);
				m.delete();
				return message.channel.send(embed);
			} catch (e) {
				m.delete();
				console.log(e);

				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
			}
		} else if (todo == "from") {
			try {
				const res = await axios.get(
					`https://no-api-key.com/api/v1/binary-text?binary=${text}`
				);
				const body = res.data;

				const embed = BaseEmbed(client, message, self);
				embed.setDescription(
					`${capitalize(getString(lang, "provided_by"))}: \`No-api-key API\``
				);
				embed.addField("Text", `\`${body.text}\``);
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
		} else {
			m.delete();

			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(`\`\`\`Error details: Invalid choice!\`\`\``);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}
	}
};
