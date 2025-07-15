const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseSuccessEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");

module.exports = class UnblacklistCommand extends BaseCommand {
	constructor() {
		super(
			"unblacklist",
			"owner",
			[],
			"<mention>",
			"Unblacklists a user from using the bot",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["unblacklist @Tech! Keep using the bot"],
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
		const self = this;
		const mention = message.mentions.users.first();
		let toUnblacklist;

		if (mention) {
			toUnblacklist = mention.id;
		} else {
			toUnblacklist = args[0];
		}

		if (toUnblacklist === client.user.id) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: I cannot unblacklist myself.\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (toUnblacklist === "398264990567628812") {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: I cannot unblacklist my owner!\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (!toUnblacklist) {
			return await BaseHelpEmbed(client, message, self);
		} else if (toUnblacklist.toLowerCase() === "help") {
			return await BaseHelpEmbed(client, message, self);
		} else {
			const result = await this.connection.query(`SELECT * from botBlacklist`);
			const blacklistedUsers = result[0];

			if (blacklistedUsers.length !== 0) {
				const blocked = blacklistedUsers.filter(
					(el) => el.userId === toUnblacklist
				)[0];

				if (blocked) {
					this.connection.query(
						`DELETE FROM botBlacklist WHERE userId = '${toUnblacklist}'`
					);

					const successEmbed = await BaseSuccessEmbed(client, message, self);
					successEmbed.setDescription(
						`<@${toUnblacklist}> is now unblacklisted from using this bot.`
					);
					const msg = await message.channel.send(successEmbed);
					return msg.delete({ timeout: 10000 });
				} else {
					const errorEmbed = await BaseErrorEmbed(client, message, self);
					errorEmbed.setDescription(
						`\`\`\`\nError details: User is already unblacklisted.\`\`\``
					);
					const msg = await message.channel.send(errorEmbed);
					return msg.delete({ timeout: 10000 });
				}
			} else {
				const errorEmbed = await BaseErrorEmbed(client, message, self);
				errorEmbed.setDescription(
					`\`\`\`Error details: There is no one to unblacklist\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
		}
	}
};
