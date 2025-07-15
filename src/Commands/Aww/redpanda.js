const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class RedPandaCommand extends BaseCommand {
	constructor() {
		super(
			"redpanda",
			"aww",
			[],
			"(help)",
			"Sends a picture of a red panda",
			"",
			[],
			["redpanda help` - Sends the help command"],
			["redpanda", "redpanda help"],
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
		// Endpoint: https://some-random-api.ml/animal/red_panda
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
				const res = await this.Animals.Redpanda();

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
					iconURL: message.autohr.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: this,
					title: `Redpanda command`,
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
