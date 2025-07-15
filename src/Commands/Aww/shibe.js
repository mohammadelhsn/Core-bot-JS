const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class ShibeCommand extends BaseCommand {
	constructor() {
		super(
			"shibe",
			"aww",
			[],
			"",
			"Sends a picture of a Shibe",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["shibe help` - Sends the help command"],
			["shibe", "shibe help"],
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

		const generatingEmbed = await this.GeneratingEmbed.Base({
			client: client,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			command: this,
			provider: `Shibe online API`,
		});

		const m = await message.channel.send(generatingEmbed);
		try {
			const res = await this.Animals.Shibe();

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

			const embed = await this.ImageEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				title: "Shibe command",
				description: `${this.Utils.capitalize(
					this.Translator.getString(lang, "provided_by")
				)}: \`Shibe online API\``,
				iamge: res.file,
			});

			m.delete();
			return message.channel.send(embed);
		} catch (e) {
			m.delete();
			console.log(e);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
			});
			return message.channel.send(errEmbed);
		}
	}
};
