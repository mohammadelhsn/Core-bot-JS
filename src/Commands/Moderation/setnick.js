const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	fetchModlog,
	fetchPublicModlog,
	BaseSuccessEmbed,
	BaseHelpEmbed,
	BaseEmbed,
} = require("../../utils/structures/functions");

module.exports = class SetNickCommand extends BaseCommand {
	constructor() {
		super(
			"setnick",
			"moderation",
			[],
			"<user> <new name>",
			"Sets the mentioned users nickname in the server",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["setnick @Tech! Techmxster"],
			true,
			1000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;

		if (
			!message.member.hasPermission(["MANAGE_NICKNAMES" || "ADMINISTRATOR"])
		) {
			const errEmbed = BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: You are missing the required permissions for this command\`\`\``
			);
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}

		if (
			!message.guild.me.hasPermission(["MANAGE_NICKNAMES" || "ADMINISTRATOR"])
		) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: I am missing the required permissions\`\`\``
			);
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}

		const user =
			message.mentions.members.first() ||
			message.guild.members.cache.find((u) => u.id == args[0]) ||
			message.guild.members.cache.find((u) => u.username == args[0]);

		if (!user) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: Missing a required user\`\`\``
			);
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}

		const name = args.slice(1).join(" ");

		if (!name) {
			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: Missing a required name\`\`\``
			);
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}

		try {
			user.setNickname(name);

			const successEmbed = await BaseSuccessEmbed(client, message, self);
			successEmbed.setDescription(
				`Successfully set <@${user.id}>'s name to \`${name}\``
			);
			message.channel.send(successEmbed);

			const result = await this.connection.query(
				`SELECT caseNumber FROM GuildModerations WHERE guildId = '${message.guild.id}'`
			);
			const caseNumber = await result[0];
			const mappedCaseNumber = caseNumber.map((r) => r.caseNumber);
			const updatedCaseNumber = mappedCaseNumber.length + 1;

			const modlog = await fetchModlog(this.connection, message.guild.id);
			const publicmodlog = await fetchModlog(this.connection, message.guild.id);

			const embed = BaseEmbed(client, message, self);
			embed.setTitle("New moderation");
			embed.setDescription(`Action: \`Nickname set\``);
			embed.addField("User", `<@${user.id}>`);
			embed.addField("Moderator", `<@${message.author.id}>`);
			embed.addField("Date", `\`${message.createdAt.toLocaleString()}\``);
			embed.addField("Case number", `\`${updatedCaseNumber}\``);
			embed.setThumbnail(user.user.displayAvatarURL({ dynamic: true }));

			let modlogmsg;
			let pmodlogmsg;
			if (modlog) {
				modlogmsg = await client.channels.cache.get(modlog).send(embed);
			}
			if (publicmodlog) {
				pmodlogmsg = await client.channels.cache.get(publicmodlog).send(embed);
			}
		} catch (e) {
			console.log(e);

			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: An unexpected error has occurred\`\`\``
			);
			const m = await message.channel.send(errEmbed);
			return m.delete({ timeout: 10000 });
		}
	}
};
