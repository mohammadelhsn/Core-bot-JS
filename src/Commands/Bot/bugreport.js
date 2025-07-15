const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseSuccessEmbed,
} = require("../../utils/structures/functions");

module.exports = class BugReportCommand extends BaseCommand {
	constructor() {
		super(
			"bugreport",
			"bot",
			["breport", "br", "brepo"],
			"<report>",
			"Sends a report of a bug to the developer of the bot",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["bugreport help` - Sends the help command"],
			["bugreport error in botinfo command", "bugreport help"],
			true,
			30000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}

	async run(client, message, args) {
		const bug = args.join(" ");
		if (!bug) {
			return await BaseHelpEmbed(client, message, this);
		} else if (bug.toLowerCase() === "help") {
			return await BaseHelpEmbed(client, message, this);
		} else {
			const thanksEmbed = await BaseSuccessEmbed(client, message, this);
			thanksEmbed.setDescription(
				`Your bug report will be evaluated ASAP. \`Please note if this is a troll, you will be blacklisted from using the bot\``
			);
			try {
				message.author.send(thanksEmbed);
			} catch (e) {
				console.log(e);

				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`Error details: Couldn't DM user\`\`\``
				);
				return message.channel.send(errorEmbed);
			}

			const bugReportEmbebd = BaseEmbed(client, message, this)
				.setTitle(`${message.author.username} has a bug report!`)
				.setDescription(`Bug report: ${bug}`)
				.setFooter(
					`ID: ${message.author.id}`,
					client.user.displayAvatarURL({ dynamic: true })
				);
			client.channels.cache.get("700083327972933723").send(bugReportEmbebd);
			return;
		}
	}
};
