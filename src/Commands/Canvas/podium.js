const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const dig = require("discord-image-generation");
const { MessageAttachment } = require("discord.js");
const {
	BaseHelpEmbed,
	BaseGeneratingEmbed,
	BaseErrorEmbed,
	BaseEmbed,
	getString,
	getLang,
} = require("../../utils/structures/functions");

module.exports = class LisaCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"podium",
			"canvas",
			[],
			"",
			"Make a podium 1st, 2nd, and 3rd, place!",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["podium` help"],
			["podium", "podium help"],
			true,
			5000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const lang = await getLang(message.guild.id, this.connection);
		const self = this;
		// Endpoint: https://some-random-api.ml/canvas/youtube-comment/?avatar=&username=&comment=
		if (args[0]) {
			return await BaseHelpEmbed(client, message, self);
		} else {
			let timedOut = false;

			const isFromAuthor = (m) => m.author.id == message.author.id;

			const options = {
				max: 1,
				time: 60000,
			};

			const tEmbed = BaseEmbed(client, message, this).setDescription(
				"Please mention the first user"
			);
			await message.channel.send(tEmbed);

			const firstColl = await message.channel.awaitMessages(
				isFromAuthor,
				options
			);

			if (firstColl.size > 0) {
				let user1;
				if (firstColl.first().mentions.members.size > 0) {
					user1 = firstColl.first().mentions.members.first();
				}

				const dEmbed = BaseEmbed(client, message, this).setDescription(
					`Please mention the second user`
				);

				await message.channel.send(dEmbed);
				const secondColl = await message.channel.awaitMessages(
					isFromAuthor,
					options
				);

				if (secondColl.size > 0) {
					let user2;
					if (secondColl.first().mentions.members.size > 0) {
						user2 = secondColl.first().mentions.members.first();
					}

					const cEmbed = BaseEmbed(client, message, this).setDescription(
						`Now for the the third and final member`
					);
					await message.channel.send(cEmbed);
					const thirdColl = await message.channel.awaitMessages(
						isFromAuthor,
						options
					);

					if (thirdColl.size > 0) {
						let user3;
						if (thirdColl.first().mentions.members.size > 0) {
							user3 = thirdColl.first().mentions.members.first();
						}
						const gEmbed = await BaseGeneratingEmbed(client, message, self);
						gEmbed.setDescription(
							`${getString(lang, "provided_by")}: \`Discord-image-generation\``
						);

						const m = await message.channel.send(gEmbed);
						try {
							const image = await new dig.Podium().getImage(
								`${user1.user.displayAvatarURL({ format: "png" })}`,
								`${user2.user.displayAvatarURL({ format: "png" })}`,
								`${user3.user.displayAvatarURL({ format: "png" })}`,
								`${user1.user.username}`,
								`${user2.user.username}`,
								`${user3.user.username}`
							);
							const attachment = new MessageAttachment(image, "podium.png");
							m.delete();
							return message.channel.send(attachment);
						} catch (e) {
							m.delete();
							console.log(e);

							const eEmbed = await BaseErrorEmbed(client, message, self);
							eEmbed.setDescription(
								"```Error details: An unexpected error has occurred```"
							);
							return message.channel.send(eEmbed);
						}
					} else timeout = true;
				} else timedOut = true;
			} else timedOut = true;
		}
	}
};
