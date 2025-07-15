const BaseCommand = require("../../utils/structures/BaseCommand");
const { BaseHelpEmbed } = require("../../utils/structures/functions");

module.exports = class BearCommand extends BaseCommand {
	constructor() {
		super(
			"bear",
			"aww",
			[],
			"bear",
			"Sends a picture of a bear",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["bear help` - Sends the help embed"],
			["bear", "bear help"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		// API: https://no-api-key.com/api/v1/animals/bear
		const lang = await this.Translator.getLang(message.guild.id);
		const self = this;

		if (args[0]) {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: self,
				message: message,
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.NoApiKey({
			client: client,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			command: self,
		});
		const m = await message.channel.send(generatingEmbed);

		try {
			const res = await this.Animals.Bear();

			if (res.error == true) {
				m.delete();

				const errorEmbed = await this.ErrorEmbed.ApiError({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: self,
				});
				return message.channel.send(errorEmbed);
			}
			const imageEmbed = await this.ImageEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: self,
				title: "Bear command",
				description: `${self.Utils.capitalize(
					self.Translator.getString(lang, "provided_by")
				)}: \`No-api-key API\``,
				image: res.file,
			});
			m.delete();
			return message.channel.send(imageEmbed);
		} catch (e) {
			m.delete();
			console.log(e);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: self,
			});
			return message.channel.send(errEmbed);
		}
	}
};
