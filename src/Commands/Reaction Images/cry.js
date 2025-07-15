const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const axios = require("axios");
const {
	BaseHelpEmbed,
	BaseImageEmbed,
	BaseEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	getLang,
	getString,
	capitalize,
} = require("../../utils/structures/functions");
const fetch = require("node-fetch");

module.exports = class CryCommand extends BaseCommand {
	constructor() {
		super(
			"cry",
			"reaction images",
			["cri"],
			"(help)",
			"Sends a crying image.",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["cry help` - Sends the help embed"],
			["cry", "cry help"],
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
		const self = this;

		if (args[0]) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const generatingEmbed = await this.GeneratingEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: self,
				provider: "Nekos fun API",
			});

			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await this.Reactions.Cry();

				const imageEmbed = await this.ImageEmbed.Base({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: self,
					title: `Cry command`,
					description: `<@${message.author.id}> is crying :sob:`,
					image: res.file,
				});

				m.delete();
				return message.channel.send(imageEmbed);
			} catch (e) {
				m.delete();
				console.log(e);

				return message.channel.send(
					await this.ErrorEmbed.UnexpectedError({
						client: client,
						id: message.guild.id,
						iconURL: message.author.id,
						command: self,
					})
				);
			}
		}
	}
};
