const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class RacoonCommand extends BaseCommand {
	constructor() {
		super(
			"racoon",
			"aww",
			[],
			"(help)",
			"Sends a picture of a racoon",
			"",
			[],
			["racoon help` - Sends the help command"],
			["racoon", "racoon help"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		// Endpoint: https://some-random-api.ml/animal/racoon
		const self = this;
		const lang = await this.Translator.getLang(message.guild.id);
		if (args[0]) {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				message: message,
			});
		} else {
			const gEmbed = await this.GeneratingEmbed.SomeRandomApi({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
			});

			const m = await message.channel.send(gEmbed);
			try {
				const res = await this.Animals.Racoon();

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

				const imageEmbed = await this.ImageEmbed.Base({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: this,
					title: `Racoon command`,
					description: `${this.Utils.capitalize(
						this.Translator.getString(lang, "provided_by")
					)}: \`some-random-api\``,
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
					command: this,
				});
				return message.channel.send(errEmbed);
			}
		}
	}
};
