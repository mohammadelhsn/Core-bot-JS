const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class GooseCommand extends BaseCommand {
	constructor() {
		super(
			"goose",
			"aww",
			[],
			"(help)",
			"Sends a picture of a goose!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["goose help` - Sends the help command"],
			["goose", "goose help"],
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
		const gEmbed = await this.GeneratingEmbed.NekosLife({
			client: client,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			command: self,
		});
		const m = await message.channel.send(gEmbed);
		try {
			const res = await this.Animals.Goose();

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

			const embed = await this.ImageEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				title: `Goose command`,
				description: `${this.Utils.capitalize(
					this.Translator.getString(lang, "provided_by")
				)}: \`Nekos life API\``,
				image: res.file,
			});

			m.delete();
			return message.channel.send(embed);
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
