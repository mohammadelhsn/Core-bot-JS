const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const figlet = require("figlet");
const {
	BaseErrorEmbed,
	BaseGeneratingEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");

module.exports = class BannerCommand extends BaseCommand {
	constructor() {
		super(
			"banner",
			"miscellaneous",
			[],
			"<text || help>",
			"Makes a banner for you using the provided text!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["banner help` - Sends the help embed"],
			["banner help", "banner hello there"],
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
		const self = this;

		let text;
		if (args[0]) {
			if (args[0] == "help") {
				return await BaseHelpEmbed(client, message, self);
			} else {
				text = args.join(" ");
			}
		}

		const gEmbed = await BaseGeneratingEmbed(client, message, this);
		gEmbed.setDescription(
			`${this.Utils.capitalize(
				this.Translator.getString(lang, "provided_by")
			)}: \`No-api-key API\``
		);

		if (!text) {
			m.delete();

			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: Missing required text\`\`\``
			);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}

		let t;

		const banner = figlet(text, "Ghoulish", async function (err, data) {
			if (err) {
				m.delete();

				return message.channel.send({
					embed: self.ErrorEmbed.UnexpectedError({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						command: self,
					}),
				});
			} else {
				t = data;
			}
		});

		const m = await message.channel.send(gEmbed);

		try {
			m.delete();

			return message.channel.send(t, { code: true });
		} catch (e) {
			m.delete();
			console.log(e);

			return message.channel.send({
				embed: self.ErrorEmbed.UnexpectedError({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: self,
				}),
			});
		}
	}
};
