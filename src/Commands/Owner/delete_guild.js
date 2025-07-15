const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseSuccessEmbed,
} = require("../../utils/structures/functions");

module.exports = class DeleteGuildCommand extends BaseCommand {
	constructor() {
		super(
			"deleteguild",
			"owner",
			[],
			"<guild id>",
			"Delete a guild from the database",
			"Bot owner",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			[],
			true,
			3000,
			true,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const id = args[0];
		const self = this;
		if (!id) {
			const embed = await BaseErrorEmbed(client, message, self);
			embed.setDescription(
				`\`\`\`Error details: You must include a guild ID\`\`\``
			);
			const msg = await message.channel.send(embed);
			return msg.delete({ timeout: 10000 });
		}

		try {
			await this.connection.query(
				`DELETE FROM chatmoney WHERE guildId = '${id}'`
			);
			await this.connection.query(
				`DELETE FROM economy WHERE guildId = '${id}'`
			);
			await this.connection.query(
				`DELETE FROM guildafk WHERE guildId = '${id}'`
			);
			await this.connection.query(
				`DELETE FROM GuildConfigurable WHERE guildId = '${id}'`
			);
			await this.connection.query(
				`DELETE FROM GuildLogging WHERE guildId = '${id}'`
			);
			await this.connection.query(
				`DELETE FROM GuildMemberEconomy WHERE guildId = '${id}'`
			);
			await this.connection.query(
				`DELETE FROM GuildMemberExperience WHERE guildId = '${id}'`
			);
			await this.connection.query(
				`DELETE FROM GuildModerations WHERE guildId = '${id}'`
			);
			await this.connection.query(`DELETE FROM Guilds WHERE guildId = '${id}'`);
			await this.connection.query(
				`DELETE FROM modnotes WHERE guildId = '${id}'`
			);
			await this.connection.query(
				`DELETE FROM protectedrole WHERE guildId = '${id}'`
			);
			await this.connection.query(
				`DELETE FROM protectedusers WHERE guildId = '${id}'`
			);
			await this.connection.query(`DELETE FROM ranks WHERE guildId = '${id}'`);
			await this.connection.query(
				`DELETE FROM rolepersist WHERE guildId = '${id}'`
			);
			await this.connection.query(
				`DELETE FROM serverroles WHERE guildId = '${id}'`
			);
			await this.connection.query(`DELETE FROM tags WHERE guildId = '${id}'`);
			await this.connection.query(
				`DELETE FROM welcomesystem WHERE guildId = '${id}'`
			);
			await this.connection.query(
				`DELETE FROM xpsystem WHERE guildId = '${id}'`
			);

			const embed = await BaseSuccessEmbed(client, message, self);
			embed.setDescription(
				`Successfully deleted guild \`${id}\` from database`
			);
			const msg = await message.channel.send(embed);
			return msg.delete({ timeout: 10000 });
		} catch (e) {
			console.log(e);

			const embed = await BaseErrorEmbed(client, message, self);
			embed.setDescription(
				`\`\`\`Error details: An unexpected error has occurred\`\`\``
			);
			const msg = await message.channel.send(embed);
			return msg.delete({ timeout: 10000 });
		}
	}
};
