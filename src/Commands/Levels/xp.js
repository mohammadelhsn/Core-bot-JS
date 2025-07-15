const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");

module.exports = class XpCommand extends BaseCommand {
	constructor() {
		super(
			"xp",
			"levels",
			[],
			"(min || max) (amount)",
			"",
			"",
			[],
			[],
			[],
			true,
			3000,
			false,
			false,
			[],
			"WIP"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;

		const max = args[0];
		const value = args[1];

		if (!max) {
			// display current settings
		} else {
			if (max.toLowerCase() == "help") {
				return await BaseHelpEmbed(client, message, self);
			} else if (max.toLowerCase() == "min") {
				if (!value) {
					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription(
						`\`\`\`Error details:  Missing a required argument\`\`\``
					);
					return message.channel.send(errEmbed);
				}
			} else if (max.toLowerCase() == "max") {
				if (!value) {
					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription(
						`\`\`\`Error details: Missing a required argument\`\`\``
					);
					return message.channel.send(errEmbed);
				}
			} else {
				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(`\`\`\`Error details: Invalid choice!!!\`\`\``);
				return message.channel.send(errEmbed);
			}
		}
	}
};
