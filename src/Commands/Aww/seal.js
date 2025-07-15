const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class SealCommand extends BaseCommand {
	constructor() {
		super(
			"seal",
			"aww",
			[],
			"",
			"Sends a picture of a seal",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["seal help` - Sends the help command"],
			["seal", "seal help"],
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

		const generatingEmbed = await this.GeneratingEmbed.Duncte123({
			client: client,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			command: this,
		});
		const m = await message.channel.send(generatingEmbed);
		try {
			const res = await this.Animals.Seal();

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
			} else {
				const sealEmbed = await this.ImageEmbed.Base({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: this,
					title: "Seal command",
					description: `${this.Utils.capitalize(
						this.Translator.getString(lang, "provided_by")
					)}: \`Duncte123 API\` | ID: ${res.id}`,
					iamge: res.file,
				});

				m.delete();
				return message.channel.send(sealEmbed);
			}
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
