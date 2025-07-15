const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class ErrorCommand extends BaseCommand {
	constructor() {
		super(
			"error",
			"bot",
			["err"],
			"(error)",
			"Gives more details about the errors the bot returns",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[
				"error argument`",
				"error api`",
				"error nsfw`",
				"error wip`",
				"error choice`",
				"error permissions`",
				"error help`",
			],
			["error argument", "error help"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		let error = args[0];

		if (!error) {
			const embed = await this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: "Error command",
				description: "Error command arguments",
				fields: [
					{ nane: "Error: `Argument`", value: "Command: `!error argument`" },
					{ name: "Error: `API`", value: "Command: `!error api`" },
					{ name: "Error: `NSFW`", value: "Command: `!error nsfw`" },
					{ name: "Error: `WIP`", value: "Command: `!error wip`" },
					{ name: "Error: `Choice`", value: "Command: `!error choice`" },
					{
						name: "Error: `Permissions`",
						value: "Command: `!error permissions`",
					},
				],
			});
			return message.channel.send({ embed: embed });
		}

		if (error.toLowerCase().includes("help")) {
			return await this.HelpEmbed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				message: message,
				command: this,
			});
		} else if (error.toLowerCase().includes("argument")) {
			const missingArgumetEmbed = this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: "Error: `Missing argument`",
				description:
					"Information: Missing argument errors occur when an argument necessary for the command to work is missing. To fix this error you simply have to include the missing argument.",
			});
			return message.channel.send({ embed: missingArgumetEmbed });
		} else if (error.toLowerCase().includes("api")) {
			const apiError = this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: "Error: `API error`",
				description:
					"Information: API errors occur when there is no response from the API",
			});
			return message.channel.send(apiError);
		} else if (error.toLowerCase().includes("nsfw")) {
			const nsfwError = this.Embed.Base({
				client: client,
				iconURL: message.auhtor.displayAvatarURL({ dynamic: true }),
				command: this,
				title: "Error: `NSFW error`",
				description:
					"Information: NSFW error occurs when the command being used isn't being used in an NSFW channel.",
			});
			return message.channel.send({ embed: nsfwError });
		} else if (error.toLowerCase().includes("wip")) {
			const wipEmbed = this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: "Error: `WIP`",
				description:
					"Information: Occurs when the command / feature is not yet functional",
			});
			return message.channel.send({ embed: wipEmbed });
		} else if (error.toLowerCase().includes("choice")) {
			const invalidChoice = this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: "Error: `Invalid choice`",
				description:
					"Information: Occurs when the choice given isn't a valid choice that the command requires to function.",
			});
			return message.channel.send({ embed: invalidChoice });
		} else if (error.toLowerCase().includes("permissions")) {
			const permissionsEmbed = this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: "Error: `Missing permissions`",
				description:
					"Information: Occurs when the user invoking the command doesn't have the permissions for the command",
			});

			return message.channel.send({ embed: permissionsEmbed });
		} else {
			const embed = this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: "Error command",
				description: "Error command arguments",
				fields: [
					{ nane: "Error: `Argument`", value: "Command: `!error argument`" },
					{ name: "Error: `API`", value: "Command: `!error api`" },
					{ name: "Error: `NSFW`", value: "Command: `!error nsfw`" },
					{ name: "Error: `WIP`", value: "Command: `!error wip`" },
					{ name: "Error: `Choice`", value: "Command: `!error choice`" },
					{
						name: "Error: `Permissions`",
						value: "Command: `!error permissions`",
					},
				],
			});
			return message.channel.send({ embed: embed });
		}
	}
};
