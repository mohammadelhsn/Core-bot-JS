const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class CatCommand extends BaseCommand {
	constructor() {
		super(
			"cat",
			"aww",
			[],
			"(help)",
			"Sends a picture of a cat!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["cat help` - Sends the help command"],
			["cat", "cat help"],
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
			const res = await this.Animals.Cat();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: this,
				});
				const msg = await message.channel.send(errEmbed);
				return msg.delete({ timeout: 10000 });
			}

			const catEmbed = await this.ImageEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				title: `Cat command`,
				description: `${this.Utils.capitalize(
					this.Translator.getString(lang, "provided_by")
				)} \`Nekos Life\``,
				image: res.file,
			});

			m.delete();
			return message.channel.send(catEmbed);
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
