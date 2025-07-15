const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class FoxCommand extends BaseCommand {
	constructor() {
		super(
			"fox",
			"aww",
			[],
			"(help)",
			"Sends a picture of a fox!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["fox help` - Sends the help command"],
			["fox", "fox help"],
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

		const generatingEmbed = await this.GeneratingEmbed.Duncte123({
			client: client,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			command: this,
		});
		const m = await message.channel.send(generatingEmbed);
		try {
			const res = await this.Animals.Fox();

			if (res.error == true) {
				m.delete();

				const errEmbed = await this.ErrorEmbed.Duncte123({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: this,
				});
				const msg = await message.channel.send(errEmbed);
				return msg.delete({ timeout: 10000 });
			}

			const foxEmbed = await this.ImageEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				title: "Fox command",
				description: `${this.Utils.capitalize(
					this.Translator.getString(lang, "provided_by")
				)}: \`Duncte123 API\` | ID: ${res.id}`,
				image: res.file,
			});

			m.delete();
			return message.channel.send(foxEmbed);
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
