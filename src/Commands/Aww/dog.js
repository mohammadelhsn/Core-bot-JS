const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class DogCommand extends BaseCommand {
	constructor() {
		super(
			"dog",
			"aww",
			[],
			"(help)",
			"Sends a picture of a dog!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["dog help` - Sends the help command"],
			["dog", "dog help"],
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

		const generatingEmbed = await this.GeneratingEmbed.DogCeoApi({
			client: client,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			command: this,
		});
		const m = await message.channel.send(generatingEmbed);
		try {
			const res = await this.Animals.Dog();

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
			const dogEmbed = await this.ImageEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				title: "Dog command",
				description: `${this.Utils.capitalize(
					this.Translator.getString(lang, "provided_by")
				)}: \`Dog CEO API\``,
				image: res.file,
			});

			m.delete();
			return message.channel.send(dogEmbed);
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
