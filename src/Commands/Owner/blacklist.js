const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
} = require("../../utils/structures/functions");

module.exports = class BlacklistCommand extends BaseCommand {
	constructor() {
		super(
			"blacklist",
			"owner",
			[],
			"(mention)",
			"Blacklists the user from using the bot in all servers",
			"Owner",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["blacklist help` - Sends the help embed"],
			["blacklist @Tech!"],
			true,
			1000,
			true,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const mention = message.mentions.users.first();
		let toBlacklist;
		if (mention) {
			toBlacklist = mention.id;
		} else {
			toBlacklist = args[0];
		}

		if (toBlacklist === client.user.id) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`\nError details: I cannot blacklist myself.\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (toBlacklist === "398264990567628812") {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`\nError details: I cannot blacklist my owner!\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (!toBlacklist) {
			return await BaseHelpEmbed(client, message, this);
		} else if (toBlacklist.toLowerCase().includes("help")) {
			return await BaseHelpEmbed(client, message, this);
		} else {
			let reason = args[1].slice(0);

			if (!reason) reason = "No reason given.";

			const result = await this.connection.query(`SELECT * from botBlacklist`);
			const blacklistedUsers = result[0];

			if (blacklistedUsers.length !== 0) {
				const blocked = blacklistedUsers.filter(
					(el) => el.userId === toBlacklist
				)[0];

				if (blocked) {
					const errorEmbed = await BaseErrorEmbed(client, message, this);
					errorEmbed.setDescription(
						`\`\`\`Error details: User is already blacklisted.\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				} else {
					this.connection.query(
						`INSERT INTO botBlacklist(userId, reason) VALUES ('${toBlacklist}', '${reason}')`
					);

					const successEmbed = await BaseSuccessEmbed(client, message, this);
					successEmbed.setDescription(
						`<@${toBlacklist}> is now blacklisted from using this bot. Reason: ${reason}`
					);
					return message.channel.send(successEmbed);
				}
			} else {
				this.connection.query(
					`INSERT INTO botBlacklist(userId, reason) VALUES ('${toBlacklist}', '${reason}')`
				);

				const successEmbed = await BaseSuccessEmbed(client, message, this);
				successEmbed.setDescription(
					`<@${toBlacklist}> is now blacklisted from using this bot. Reason: ${reason}`
				);
				return message.channel.send(successEmbed);
			}
		}
	}
};
