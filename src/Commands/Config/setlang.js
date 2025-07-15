const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseSuccessEmbed,
	BaseEmbed,
	getString,
} = require("../../utils/structures/functions");
const iso = require("iso-639-1");

module.exports = class SetlangCommand extends BaseCommand {
	constructor() {
		super(
			"setlang",
			"config",
			["set-language", "setlanguage", "botlang"],
			"<language>",
			"Set the language for the bot",
			"Administrator",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["setlang english"],
			true,
			10000,
			false,
			false,
			["ADMINISTRATOR"],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;

		if (!message.member.hasPermission(["ADMINISTRATOR"])) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: You are missing the permissions required for this command\`\`\``
			);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const language = args.join(" ");
		if (!language) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				"```Error details: You must include a language.```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		let code;
		try {
			code = iso.getCode(language);

			if (!code) {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					"```Error details: No code found for given language.```"
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			} else {
				this.connection.query(
					`UPDATE GuildConfigurable SET lang = '${code}' WHERE guildId = '${message.guild.id}'`
				);

				const successEmbed = await BaseSuccessEmbed(client, message, self);
				return message.channel.send(successEmbed);
			}
		} catch (e) {
			console.log(e);

			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: ${getString(code, "unexpected_error")}\`\`\``
			);
			return message.channel.send(errEmbed);
		}
	}
};
