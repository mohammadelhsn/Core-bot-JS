const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseSuccessEmbed,
	BaseHelpEmbed,
	getString,
	getLang,
} = require("../../utils/structures/functions");

module.exports = class LeaveCommand extends BaseCommand {
	constructor() {
		super(
			"leave",
			"music",
			["stop", "disconnect"],
			"",
			"Forces the bot to leave the voice channel.",
			"",
			["SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK"],
			["leave help` - Sends the help embed"],
			["leave", "leave help"],
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

		if (args[0]) {
			return await BaseHelpEmbed(client, message, this);
		}

		if (!voiceChannel) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: You must be in a voice channel\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
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

		try {
			player.destroy(message.guild.id);
		} catch (e) {
			console.log(e);

			const errEmbed = await BaseErrorEmbed(client, message, this);
			errEmbed.setDescription(
				`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
			);
			return message.channel.send(errEmbed);
		}

		const successEmbed = await BaseSuccessEmbed(client, message, this);
		successEmbed.setDescription("Successfully stopped playing music!");
		return message.channel.send(successEmbed);
	}
};
