const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class KoalaCommand extends BaseCommand {
	constructor() {
		super(
			"koala",
			"aww",
			[],
			"(help)",
			"Sends a picture of a koala!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["koala help` - Sends the help command"],
			["koala", "koala help"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		// Endpoint: https://some-random-api.ml/animal/koala

		const lang = await this.Translator.getLang(message.guild.id);

		if (args[0]) {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		} else {
			const generatingEmbed = await this.GeneratingEmbed.SomeRandomApi({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
			});
			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await this.Animals.Koala();

				if (res.error == true) {
					m.delete();

					const errEmbed = await this.ErrorEmbed.ApiError({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						command: this,
					});
					const msg = await message.channel.send(errEmbed);
					return msg.delete({ timeout: 10000 });
				}

				const imageEmbed = await this.ImageEmbed.Base({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: this,
					title: `Koala command`,
					description: `${this.Utils.capitalize(
						this.Translator.getString(lang, "provided_by")
					)}: \`some-random-api\``,
				});

				m.delete();
				return message.channel.send(imageEmbed);
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
	}
};
