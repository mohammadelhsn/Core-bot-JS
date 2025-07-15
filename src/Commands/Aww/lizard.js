const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class LizardCommand extends BaseCommand {
	constructor() {
		super(
			"lizard",
			"aww",
			[],
			"(help)",
			"Sends a picture of a lizard",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["lizard help` - Sends the help command"],
			["lizard", "lizard help"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		const lang = await this.Translator.getLang(message.guild.id);

		if (args[0]) {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		const generatingEmbed = await this.GeneratingEmbed.NekosLife({
			client: client,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			command: this,
		});
		const m = await message.channel.send(generatingEmbed);
		try {
			const res = await this.Animals.Lizard();

			if (res.error == true) {
				m.delete();

				const errorEmbed = await this.ErrorEmbed.ApiError({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: this,
				});
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
			const lizardEmbed = await this.ImageEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				title: "Lizard command",
				description: `${this.Utils.capitalize(
					this.Translator.getString(lang, "provided_by")
				)}: \`Nekos Life API\``,
				image: res.file,
			});

			m.delete();
			return message.channel.send(lizardEmbed);
		} catch (e) {
			m.delete();
			console.log(e);

			const errorEmbed = await this.ErrorEmbed.UnexpectedError({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
			});
			return message.channel.send(errorEmbed);
		}
	}
};
