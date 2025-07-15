const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const request = require("superagent");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	getString,
	getLang,
	capitalize,
} = require("../../utils/structures/functions");

// Enter command name and change class name to command name {command}
module.exports = class AdviceCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"advice",
			"fun",
			[],
			"",
			"Gives you some advice!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["advice help` - Sends the help embed"],
			["advice", "advice help"],
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
		if (args[0]) {
			if (args[0].toLowerCase().includes("help")) {
				return await BaseHelpEmbed(client, message, self);
			}
		}
		const generatingEmbed = await BaseGeneratingEmbed(client, message, this);
		generatingEmbed.setDescription(
			`${capitalize(getString(lang, "provided_by"))}: \`Advice slip API`
		);

		const m = await message.channel.send(generatingEmbed);

		try {
			if (!args[0]) {
				request
					.get("http://api.adviceslip.com/advice")
					.end(async (err, res) => {
						if (!err && res.status === 200) {
							try {
								JSON.parse(res.text);
							} catch (e) {
								const errorEmbed = await BaseErrorEmbed(client, message, this);
								errorEmbed.setDescription(
									`\`\`\`\Error details: API error\`\`\``
								);
								return message.channel.send(errorEmbed);
							}
							const advice = JSON.parse(res.text);

							const embed = BaseEmbed(client, message, this).setDescription(
								`Advice: \`${advice.slip.advice}\``
							);

							m.delete();
							return message.channel.send(embed);
						}
					});
			}
		} catch (e) {
			console.log(e);

			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
			);
			return message.channel.send(errorEmbed);
		}
	}
};
