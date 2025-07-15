const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	fetchReports,
} = require("../../utils/structures/functions");
const { error_emoji, success_emoji } = require("../../../emojis.json");

module.exports = class ReportCommand extends BaseCommand {
	constructor() {
		super(
			"report",
			"server utilities",
			["rep"],
			"<user> <reason>",
			"Reports a user to the mods of the server",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["report @Tech! Spamming"],
			true,
			2000,
			false,
			false,
			[],
			""
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const emoji_error = client.emojis.cache.find(
			(e) => e.id == "707186665013116969"
		);
		const emoji_success = client.emojis.cache.find(
			(e) => e.id == "707186665210511423"
		);
		const reportChannel = await fetchReports(this.connection, message.guild.id);

		if (reportChannel == null) {
			const disabledReports = await BaseErrorEmbed(client, message, this);
			disabledReports.setDescription(
				`\`\`\`Error details: Reports are currently disabled.\`\`\``
			);
			const m = await message.channel.send(disabledReports);
			return m.delete({ timeout: 10000 });
		} else {
			if (args[0]) {
				if (args[0].toLowerCase().includes("help")) {
					return await BaseHelpEmbed(client, message, this);
				} else {
					const target =
						message.mentions.members.first() ||
						message.guild.members.cache.find(
							(u) => u.user.username === args[0]
						) ||
						message.guild.members.cache.find((u) => u.id === args[0]) ||
						message.guild.members.cache.find((u) => u.nickname === args[0]);
					const reason = args.slice(1).join(" ");

					if (target.user.id === message.author.id) {
						const embed = await BaseErrorEmbed(client, message, this);
						embed.setDescription(
							`\`\`\`Error details: You cannot report yourself!\`\`\``
						);
						const m = await message.channel.send(embed);
						return m.delete({ timeout: 10000 });
					}

					if (target.user.id === client.user.id) {
						const embed = await BaseErrorEmbed(client, message, this);
						embed.setDescription(
							`\`\`\`Error details: You cannot report the bot\`\`\``
						);
						const m = await message.channel.send(embed);
						return m.delete({ timeout: 10000 });
					}

					if (target.user.id === message.guild.ownerID) {
						const embed = await BaseErrorEmbed(client, message, this);
						embed.setDescription(
							`\`\`\`Error details: You cannot report the guild owner\`\`\``
						);
						const m = await message.channel.send(embed);
						return m.delete({ timeout: 10000 });
					}
					if (!target) {
						const missingMention = await BaseErrorEmbed(client, message, this);
						missingMention.setDescription(
							"```Error details: You are missing the mention.```"
						);
						const m = await message.channel.send(missingMention);
						return m.delete({ timeout: 10000 });
					} else if (!reason) {
						const missingReason = await BaseErrorEmbed(client, message, this);
						missingReason.setDescription(
							"```Error details: You are missing the reason.```"
						);
						const m = await message.channel.send(missingReason);
						return m.delete({ timeout: 10000 });
					} else {
						const reportEmbed = BaseEmbed(client, message, this)
							.setTitle(`New report`)
							.setDescription(`React to ${success_emoji} or ${error_emoji}`)
							.addField("Offender:", `<@${target.user.id}>`)
							.addField("Reported by:", `\`${message.author.username}\``)
							.addField("Reason", `\`${reason}\``)
							.addField("Date", `\`${message.createdAt.toLocaleString()}\``)
							.setThumbnail(target.user.displayAvatarURL({ dynamic: true }));
						client.channels.cache
							.get(`${reportChannel}`)
							.send(reportEmbed)
							.then(async (msg) => {
								await msg.react(emoji_success);
								await msg.react(emoji_error);
							});
					}
				}
			} else {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					"```Error details: You must mention someone```"
				);
				const m = await message.channel.send(errorEmbed);
				return m.delete({ timeout: 10000 });
			}
		}
	}
};
