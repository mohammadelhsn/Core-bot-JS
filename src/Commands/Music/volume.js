const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseSuccessEmbed,
	BaseHelpEmbed,
	getLang,
	getString,
} = require("../../utils/structures/functions");

module.exports = class VolumeCommand extends BaseCommand {
	constructor() {
		super(
			"volume",
			"music",
			["vol"],
			"<1-100>",
			"Changes the volume the player plays at.",
			"",
			["SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK"],
			["volume help` - Sends the help embed"],
			["volume 100", "volume help"],
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
		const self = this;
		const lang = await getLang(message.guild.id, this.connection);
		const player = client.manager.players.get(message.guild.id);
		if (!player) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				"```Error details: There is no music playing at the moment```"
			);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			const errEmbed = await BaseErrorEmbed(client, message, this);
			errEmbed.setDescription(
				"```Error details: You are not connected to the voice channel```"
			);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (voiceChannel.id !== player.options.voiceChannel) {
			const errEmbed = await BaseErrorEmbed(client, message, this);
			errEmbed.setDescription(
				"```Error details: You are not connected to the right channel```"
			);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const volume = args[0];
		if (!volume) {
			const errEmbed = await BaseErrorEmbed(client, message, this);
			errEmbed.setDescription(
				"```Error details: You must provide a number to set volume to```"
			);
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (volume === "help") {
			return await BaseHelpEmbed(client, message, this);
		}

		if (isNaN(volume)) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				"```Error details: Provided argument is not a number```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (Number(volume) <= 0 || Number(volume) > 100) {
			const errEmbed = await BaseErrorEmbed(client, message, this);
			errEmbed.setDescription("```Error details: Number must be from 1-100```");
			const msg = await message.channel.send(errEmbed);
			return msg.delete({ timeout: 10000 });
		}
		try {
			player.setVolume(volume);
		} catch (e) {
			console.log(e);

			const errEmbed = await BaseErrorEmbed(client, message, this);
			errEmbed.setDescription(
				`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
			);
			return message.channel.send(errorEmbed);
		}
		const successEmbed = await BaseSuccessEmbed(client, message, this);
		successEmbed.setDescription(`Successfully set the volume to \`${volume}\``);
		return message.channel.send(successEmbed);
	}
};
