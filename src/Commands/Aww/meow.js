const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseImageEmbed,
	getLang,
	getString,
} = require("../../utils/structures/functions");

module.exports = class MeowCommand extends BaseCommand {
	constructor() {
		super(
			"meow",
			"aww",
			[],
			"(help)",
			"Sends a picture of a cat!",
			"",
			[],
			["meow help` - Sends the help command"],
			["meow", "meow help"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const lang = await this.Translator.getLang(message.guild.id);

		if (args[0]) {
			return await BaseHelpEmbed(client, message, this);
		} else {
			const generatingEmbed = await this.GeneratingEmbed.NekosLife({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
			});
			const m = await message.channel.send(generatingEmbed);
			try {
				const res = await this.Animals.Meow();

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
					title: `Meow command`,
					description: `${this.Utils.capitalize(
						this.Translator.getString(lang, "provided_by")
					)}: \`Nekos life\``,
					image: res.file,
				});

				m.delete();
				return message.channel.send(embed);
			} catch (e) {
				m.delete();
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}`
				);
				return message.channel.send(errorEmbed);
			}
		}
	}
};
