const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class BotClearCommand extends BaseCommand {
	constructor() {
		super(
			"botclear",
			"bot",
			["bc"],
			"(help)",
			"Clears all the bots messages in the channel",
			"Administrator",
			["MANAGE_MESSAGES", "ADMINISTRATOR"],
			["botclear help` - Sends the help command"],
			["botclear", "botclear help"],
			true,
			10000,
			false,
			false,
			["MANAGE_MESSAGES", "ADMINISTRATOR"],
			"Working"
		);
	}
	async run(client, message, args) {
		if (!message.member.hasPermission(["MANAGE_MESSAGES" || "ADMINISTRATOR"])) {
			const errorEmbed = await this.ErrorEmbed.MissingPermissions({
				client: client, 
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this
			})
			const m = await message.channel.send(errorEmbed);
			return m.delete({ timeout: 10000 });
		}

		if (
			!message.guild.me.hasPermission(["MANAGE_MESSAGES" || "ADMINISTRATOR"])
		) {
			const errorEmbed = await this.ErrorEmbed.MissingPermissions({
				client: client, 
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this
			})
			const m = await message.channel.send(errorEmbed);
			return m.delete({ timeout: 10000 });
		}
		if (args[0]) {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		message.channel.messages.fetch({ limit: 100 }).then((messages) => {
			const botmessages = [];
			messages
				.filter((m) => m.author.id === client.user.id)
				.forEach((msg) => botmessages.push(msg));

			message.channel.bulkDelete(botmessages).then(async () => {
				const successEmbed = await this.SuccessEmbed.Base({
					client: client, 
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: this,
					success_message: `Success! \`${botmessages.length}\` bot message(s) cleared`
				})

				const msg = await message.channel.send(successEmbed);
				return msg.delete({ timeout: 10000 })
			});
		});
	}
};
