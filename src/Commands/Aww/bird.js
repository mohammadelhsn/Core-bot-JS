const BaseCommand = require("../../utils/structures/BaseCommand");
const { BaseHelpEmbed } = require("../../utils/structures/functions");

module.exports = class BirdCommand extends BaseCommand {
	constructor() {
		super(
			"bird",
			"aww",
			["birb"],
			"(help)",
			"Sends a picture of a bird",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["bird help` - Sends the help command"],
			["bird", "bird help"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		const self = this;
		const lang = await this.Translator.getLang(message.guild.id);
		if (args[0]) {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: self,
				message: message,
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.Duncte123({
			client: client,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			command: self,
		});
		const m = await message.channel.send(generatingEmbed);
		try {
			const res = await this.Animals.Bird();

			if (res.error == true) {
				m.delete();

				const errEmbed = await this.ErrorEmbed.ApiError({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: self,
				});
				const msg = await message.channel.send(errEmbed);
				return msg.delete({ timeout: 10000 });
			}

			const birdEmbed = await this.ImageEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: self,
				title: "Bird command",
				description: `${this.Utils.capitalize(
					this.Translator.getString(lang, "provided_by")
				)}: \`Duncte123 API\``,
				image: res.file,
			});

			m.delete();
			return message.channel.send(birdEmbed);
		} catch (e) {
			m.delete();
			console.log(e);

			const errorEmbed = await this.ErrorEmbed.UnexpectedError({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: self,
			});
			return message.channel.send(errorEmbed);
		}
	}
};
