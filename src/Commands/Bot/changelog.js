const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class ChangelogCommand extends BaseCommand {
	constructor() {
		super(
			"changelog",
			"bot",
			[],
			"",
			"View recent bot changes",
			"",
			[],
			[],
			[],
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
		const embed = await this.Embed.Base({
			client: client,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			title: `Changelog | ${client.version}`,
			description: `Bot version: \`${client.version}\` | Updated at: \`${client.updated_at}\``,
			fields: [
				{
					name: "Additions:",
					value: `${this.Emojis.success_emoji} | Added \`transcript\` command\n${this.Emojis.success_emoji} | Bot posted on Github!`,
				},
				{
					name: "Modifications:",
					value: `${this.Emojis.success_emoji} | Cleaning code\n${this.Emojis.success_emoji} | Modified the \`COVID\` command to add vaccines and cities`,
				},
			],
		});
		return message.channel.send({ embed: embed });
	}
};
