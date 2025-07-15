const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseEmbed,
	BaseHelpEmbed,
	getString,
	getLang,
} = require("../../utils/structures/functions");
const prettyMilliseconds = require("pretty-ms");

module.exports = class NowPlayingCommand extends BaseCommand {
	constructor() {
		super(
			"nowplaying",
			"music",
			["np", "current"],
			"",
			"Displays what is currently playing the guild",
			"",
			["SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK"],
			["nowplaying help` - Sends the help embed"],
			["nowplaying", "nowplaying help"],
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
				"```Error details: You aren't not in my voice channel!```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (args[0]) {
			return await BaseHelpEmbed(client, message, this);
		}

		const player = client.manager.players.get(message.guild.id);
		if (!player || !player.queue.current) {
			const errEmbed = await BaseErrorEmbed(client, message, this);
			errEmbed.setDescription("```Error details: There is no music playing```");
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (voiceChannel.id !== player.options.voiceChannel) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				"```Error details: You are not in the same voice channel as the player```"
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		try {
			const title = player.queue.current.title;
			const uri = player.queue.current.uri;
			const author = player.queue.current.author;
			const duration = player.queue.current.duration;

			function nowplaying(duration, position) {
				let dashes = "----------------------------------------";
				let time = duration / 40; //Dividing by number of dashes

				let pointer = Math.floor(position / time); //Getting an integer which can be used as position index further

				let replacement = dashes.split(""); //Splitting dashes into array
				replacement[pointer] = "+"; //Replacing the position dash with pointer

				let final = replacement.join(""); //Joining the array again after replacment of dash with a pointer. ------+---------------------------------

				return final;
			}

			const em = BaseEmbed(client, message, this)
				.setAuthor(
					client.user.username,
					client.user.displayAvatarURL({ dynamic: true })
				)
				.setTitle(title)
				.setDescription(
					`\`${prettyMilliseconds(player.position, {
						colonNotation: true,
					})}\` / \`${prettyMilliseconds(player.queue.current.duration, {
						colonNotation: true,
					})}\`**${nowplaying(duration, player.position)}**`
				)
				.addField("Duration", `\`${prettyMilliseconds(duration)}\``)
				.addField("By", `\`${author}\``)
				.addField(
					"Time left",
					`\`${prettyMilliseconds(duration - player.position)}\``
				)
				.addField("Requested by", `\`${player.queue.current.requester.tag}\``)
				.setURL(uri)
				.setThumbnail(player.queue.current.thumbnail);
			return message.channel.send(em);
		} catch (e) {
			console.log(e);

			const errEmbed = await BaseErrorEmbed(client, message, this);
			errEmbed.setDescription(
				`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
			);
			return message.channel.send(errEmbed);
		}
	}
};
