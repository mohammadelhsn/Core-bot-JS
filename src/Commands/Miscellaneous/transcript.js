const BaseCommand = require("../../utils/structures/BaseCommand");
const { MessageAttachment } = require("discord.js");
const { fetchTranscript } = require("reconlx");

module.exports = class TranscriptCommand extends BaseCommand {
	constructor() {
		super(
			"transcript",
			"miscellaneous",
			[],
			"",
			"",
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
		const messages = args[0];
		let type = args[1];

		if (!messages) {
			return message.channel.send(
				await this.ErrorEmbed.Base({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: self,
					error_message: "Please specify some # of messages",
				})
			);
		}
		if (isNaN(messages)) {
			return message.channel.send(
				await this.ErrorEmbed.Base({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: self,
					error_message: "Provided value is not a number!",
				})
			);
		}
		if (messages >= 100) {
			return message.channel.send(
				await this.ErrorEmbed.Base({
					client: client,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					command: self,
					error_message: "Number must be under 100",
				})
			);
		}
		if (!type) type = "html";

		if (type.toLowerCase() == "html") {
			try {
				const res = await fetchTranscript(message, parseInt(messages), false);
				const attachment = new MessageAttachment(res, "index.html");
				return message.channel.send(attachment);
			} catch (e) {
				console.log(e);

				return message.channel.send(
					await this.ErrorEmbed.UnexpectedError({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						command: self,
					})
				);
			}
		} else if (type.toLowerCase() == "csv") {
			// return a CSV file
		} else if (type.toLowerCase() == "json") {
			// return a json file with data
		} else if (type.toLowerCase() == "txt" || type.toLowerCase() == "text") {
			// return a .txt file
		}
	}
};
