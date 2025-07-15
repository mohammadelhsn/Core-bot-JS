const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const { BaseErrorEmbed } = require("../../utils/structures/functions");

module.exports = class EmbedCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"embed",
			"server utilities",
			[],
			"",
			"Create an embed using the bot",
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
		const embedc = args[0];

		if (!embedc) {
			return;
		}

		if (embedc.toLowerCase().includes("error")) {
			const errorEmbed = BaseErrorEmbed(client, message, this)
				.setFooter(
					`Embed command | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setDescription(`Test`);
			return message.channel.send(errorEmbed);
		}
	}
};
