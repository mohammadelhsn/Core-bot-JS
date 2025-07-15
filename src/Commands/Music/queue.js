const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseErrorEmbed,
	BaseHelpEmbed,
	getString,
	getLang,
} = require("../../utils/structures/functions");
const prettyMilliseconds = require("pretty-ms");

module.exports = class QueueCommand extends BaseCommand {
	constructor() {
		super(
			"queue",
			"music",
			["q"],
			"",
			"Displays the queue for the guild.",
			"",
			["SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK"],
			["queue help` - Sends the queue embed"],
			["queue"],
			true,
			1000,
			false,
			false,
			["CONNECT"],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const lang = await getLang(message.guild.id, this.connection);
		const self = this;
		const player = client.manager.get(message.guild.id);

		if (!player) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: There is nothing playing\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (args[0]) {
			return await BaseHelpEmbed(client, message, self);
		}

		let index = 1;
		let string = "";
		if (player.queue.current)
			string += `**__Currently playing__**\n ${
				player.queue.current.title
			} - Requested by: \`${
				player.queue.current.requester.tag
			}\`. | Duration: \`${prettyMilliseconds(
				player.queue.current.duration
			)}\` \n`;
		if (player.queue[0]) {
			string += `__**Rest of queue:**__\n ${player.queue
				.slice(0, 10)
				.map(
					(x) =>
						`**${index++})** ${x.title} - **Requested by ${
							x.requester.username
						}**.`
				)
				.join("\n")}`;
		}

		const embed = BaseEmbed(client, message, self)
			.setImage(player.queue.current.thumbnail)
			.setDescription(string);
		return message.channel.send(embed);
	}
};
