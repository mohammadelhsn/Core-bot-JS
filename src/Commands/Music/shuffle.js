const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseSuccessEmbed,
	BaseErrorEmbed,
	BaseHelpEmbed,
	getString,
	getLang,
} = require("../../utils/structures/functions");

module.exports = class ShuffleCommand extends BaseCommand {
	constructor() {
		super(
			"shuffle",
			"music",
			["mix"],
			"",
			"Shuffles the whole queue.",
			"",
			["SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK"],
			["shuffle help` - Sends the help embed"],
			["shuffle", "shuffle help"],
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
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: You must be in a voice channel\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (args[0]) {
			return await BaseHelpEmbed(client, message, this);
		}

		const player = client.manager.players.get(message.guild.id);
		if (!player) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: There are no active players at the moment\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (voiceChannel.id !== player.options.voiceChannel) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				"```Error details: You're not in the bots voice channel```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		//🔁

		try {
			player.queue.shuffle();
		} catch (e) {
			console.log(e);

			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
			);
			return message.channel.send(errEmbed);
		}
		const successEmbed = await BaseSuccessEmbed(client, message, self);
		successEmbed.setDescription("Successfully shuffled the queue! 🔀");
		return message.channel.send(successEmbed);
	}
};
