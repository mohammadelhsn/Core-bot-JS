const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseSuccessEmbed,
	BaseEmbed,
	BaseHelpEmbed,
	getString,
	getLang,
} = require("../../utils/structures/functions");
const prettyMilliseconds = require("pretty-ms");

module.exports = class PlayCommand extends BaseCommand {
	constructor() {
		super(
			"play",
			"music",
			[],
			"play <song || link>",
			"Play a song ",
			"",
			["SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK"],
			["play help` - Sends the help embed"],
			[
				"play https://www.youtube.com/watch?v=DLzxrzFCyOs",
				"play song",
				"play help",
			],
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

		const permissions = voiceChannel.permissionsFor(client.user);
		if (!permissions.has("CONNECT")) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: I cannot connect to this channel\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (!permissions.has("SPEAK")) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: I cannot speak in this channel\`\`\``
			);
			return message.channel.send(errorEmbed);
		}

		const search = args.join(" ");

		if (!search) {
			const errorEmbed = await BaseErrorEmbed(client, message, self);
			errorEmbed.setDescription(
				`\`\`\`Error details: Please specify a link or query\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (search == "help") {
			return await BaseHelpEmbed(client, message, this);
		}

		const player = client.manager.create({
			guild: message.guild.id,
			voiceChannel: message.member.voice.channel.id,
			textChannel: message.channel.id,
		});

		player.connect();
		const res = await client.manager.search(search, message.author);
		switch (res.loadType) {
			case "TRACK_LOADED":
				const embed = await BaseSuccessEmbed(client, message, this);
				embed.setDescription(
					`Added [${res.tracks[0].title}](${
						res.tracks[0].uri
					}) to the queue. Duration: \`${prettyMilliseconds(
						res.tracks[0].duration
					)}\``
				);
				embed.setImage(res.tracks[0].thumbnail);
				player.queue.add(res.tracks[0]);
				message.channel.send(embed);
				if (!player.playing) player.play();
				break;
			case "SEARCH_RESULT":
				let index = 1;
				const tracks = res.tracks.slice(0, 5);

				const sembed = BaseEmbed(client, message, this)
					.setTitle("There are multiple results")
					.setDescription(
						"You have `30` seconds to pick from one of those. Say `cancel` if you want to cancel the selection"
					)
					.addField(
						"Songs",
						`${tracks
							.map(
								(video) =>
									`**${index++} -** ${video.title} | \`${prettyMilliseconds(
										video.duration
									)}\``
							)
							.join("\n")}`
					);
				await message.channel.send(sembed);
				const collector = message.channel.createMessageCollector(
					(m) => {
						return (
							m.author.id === message.author.id &&
							new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
						);
					},
					{ time: 30000, max: 1 }
				);

				collector.on("collect", async (m) => {
					if (/cancel/i.test(m.content)) return collector.stop("cancelled");

					const track = tracks[Number(m.content) - 1];
					player.queue.add(track);
					const tEmbed = await BaseSuccessEmbed(client, message, this);
					tEmbed.setDescription(
						`Added [${track.title}](${
							track.uri
						}) to the queue. | Duration: \`${prettyMilliseconds(
							track.duration
						)}\``
					);
					tEmbed.setImage(track.thumbnail);
					message.channel.send(tEmbed);
					if (!player.playing) player.play();
				});

				collector.on("end", async (_, reason) => {
					if (["time", "cancelled"].includes(reason)) {
						const successEmbed = await BaseSuccessEmbed(client, message, this);
						successEmbed.setDescription("Successfully cancelled selection");
						return message.channel.send(successEmbed);
					}
				});
				break;
			case "PLAYLIST_LOADED":
				res.playlist.tracks.forEach((track) => player.queue.add(track));
				const Eembed = await BaseSuccessEmbed(client, message, this);
				Eembed.setDescription(
					`Adding \`${res.playlist.tracks.length}\` tracks in playlist \`${res.playlist.info.name}\` to the queue`
				);
				if (!player.playing) player.play();
				break;
		}
	}
};
