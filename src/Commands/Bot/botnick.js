const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class BotnickCommand extends BaseCommand {
	constructor() {
		super(
			"botnick",
			"bot",
			[],
			"",
			"Sets the bots nickname",
			"",
			["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_NICKNAMES", "ADMINISTRATOR"],
			[],
			[],
			true,
			3000,
			false,
			false,
			["MANAGE_NICKNAMES", "ADMINISTRATOR"],
			"Working"
		);
	}
	async run(client, message, args) {
		const self = this;

		if (
			!message.member.hasPermission(["MANAGE_NICKNAMES" || "ADMINISTRATOR"])
		) {
			const errEmbed = await this.ErrorEmbed.MissingPermissions({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
			});
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}
		if (
			!message.guild.me.hasPermission(["MANAGE_NICKNAMES" || "ADMINISTRATOR"])
		) {
			const errEmbed = await this.ErrorEmbed.MissingPermissions({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
			});
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}

		const name = args.join(" ");

		if (args[0].toLowerCase() == "help") {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		if (!name) {
			const errEmbed = await this.ErrorEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				error_message: `Error details: You forgot to mention a new name for the bot`,
			});
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}

		try {
			message.guild.me.setNickname(name);

			const successEmbed = await this.SuccessEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				success_message: `Successfully set the <@${client.user.id}>'s nickname to \`${name}\``,
			});
			return message.channel.send(successEmbed);
		} catch (e) {
			console.log(e);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
			});
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}
	}
};
