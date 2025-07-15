const BaseCommand = require("../../utils/structures/BaseCommand");
const request = require("node-superfetch");

module.exports = class AwwCommand extends BaseCommand {
	constructor() {
		super(
			"aww",
			"aww",
			["r/aww"],
			"(help)",
			"Generates a picture from r/Aww",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["aww help` - Sends the help command"],
			["aww", "aww help"],
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
				command: self,
				message: message,
			});
		} else {
			const gEmbed = await this.GeneratingEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: self,
				provider: "r/Aww",
			});
			const m = await message.channel.send(gEmbed);

			try {
				const { body } = await request
					.get("https://www.reddit.com/r/aww.json?sort=top&t=week")
					.query({
						limit: 800,
					});
				const allowed = message.channel.nsfw
					? body.data.children
					: body.data.children.filter((post) => !post.data.over_18);
				if (!allowed.length) {
					m.delete();
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						`\`\`\`\nError details: Cannot find any images\`\`\``
					);
					return message.channel.send(errorEmbed);
				}
				let randomnumber = Math.floor(Math.random() * allowed.length);

				while (allowed[randomnumber].data.is_video == true) {
					randomnumber = Math.floor(Math.random() * allowed.length);
				}

				const embed = await this.ImageEmbed.Base({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					title: allowed[randomnumber].data.title,
					description: `Posted by: ${allowed[randomnumber].data.author}`,
					image: allowed[randomnumber].data.url,
				});
				m.delete();
				return message.channel.send(embed);
			} catch (e) {
				m.delete();
				console.log(e);

				const embed = await this.ErrorEmbed.UnexpectedError({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: self,
				});
				return message.channel.send(embed);
			}
		}
	}
};
