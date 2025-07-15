const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
} = require("../../utils/structures/functions");

module.exports = class AnnounceCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"announce",
			"moderation",
			["ann"],
			"",
			"Make an announcement for the guild",
			"",
			[],
			"",
			"",
			true,
			10000,
			false,
			false,
			[],
			""
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		if (!message.member.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`Error details: \`You are missing required permissions\``
			);
			return message.channel.send(errorEmbed);
		}
		if (!message.guild.me.hasPermission(["MANAGE_GUILD", "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`Error details: \`I don't have the proper permissions for this command\``
			);
			return message.channel.send(errorEmbed);
		}

		let timedOut = false;

		const isFromAuthor = (m) => m.author.id == message.author.id;

		const options = {
			max: 1,
			time: 60000,
		};

		const tEmbed = BaseEmbed(client, message, this)
			.setTitle(`Announce command setup`)
			.setDescription(`Please mention a title for the announcement`);
		await message.channel.send(tEmbed);

		const firstColl = await message.channel.awaitMessages(
			isFromAuthor,
			options
		);

		if (firstColl.size > 0) {
			const title = firstColl.first().content;

			const dEmbed = BaseEmbed(client, message, this)
				.setTitle(`Announce command setup`)
				.setDescription(`Please mention the content for the announcement`)
				.setFooter(
					`Announce command | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);
			await message.channel.send(dEmbed);
			const secondColl = await message.channel.awaitMessages(
				isFromAuthor,
				options
			);

			if (secondColl.size > 0) {
				const description = secondColl.first().content;

				const cEmbed = BaseEmbed(client, message, this)
					.setTitle(`Announce command setup`)
					.setDescription(`Please mention a channel.`);
				await message.channel.send(cEmbed);
				const thridColl = await message.channel.awaitMessages(
					isFromAuthor,
					options
				);

				if (thridColl.size > 0) {
					const result = thridColl.first().content;
					const msg = thridColl.first();
					let channel =
						message.guild.channels.cache.find((c) => c.name === result) ||
						message.guild.channels.cache.find((c) => c.id === result) ||
						msg.mentions.channels.first();

					if (!channel) {
						channel = message.channel.id;
					} else {
						channel = channel.id;
					}

					const embed = BaseEmbed(client, message, this)
						.setTitle(`${title}`)
						.setDescription(`${description}`);
					client.channels.cache.get(channel).send(embed);
				} else timeout = true;
			} else timedOut = true;
		} else timedOut = true;

		if (timedOut) {
			const errorEmbed = BaseErrorEmbed(client, message, this).setDescription(
				`Error details: \`Command timed out!\``
			);
			return message.channel.send(errorEmbed);
		}
	}
};
