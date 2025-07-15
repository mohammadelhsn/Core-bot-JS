const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	getLang,
	getString,
	fetchModlog,
	fetchPublicModlog,
	getCaseNumber,
	insertModeration,
} = require("../../utils/structures/functions");

module.exports = class KickCommand extends BaseCommand {
	constructor() {
		super(
			"kick",
			"moderation",
			[],
			"!kick <user> (reason)",
			"Kicks the mentioned user for the guild",
			"",
			["SEND_MESSAGES", "EMBED_LINKS", "KICK_MEMBERS", "ADMINISTRATOR"],
			[],
			["kick @Tech! spamming"],
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
		const lang = await getLang(message.guild.id, this.connection);
		if (!message.member.hasPermission(["KICK_MEMBERS", "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`Error details: \`You are missing the permissions required for this command\``
			);
			return message.channel.send(errorEmbed);
		}

		if (!message.guild.me.hasPermission("KICK_MEMBERS", "ADMINISTRATOR")) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`Error details: \`I am missing the permissions that are required to complete this command for you\``
			);
			return message.channel.send(errorEmbed);
		}

		if (!args[0]) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription("Error details: This is a required argument");
			return message.channel.send(errorEmbed);
		}
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get((u) => u.name === args[0]) ||
			message.guild.members.cache.get((u) => u.id === args[0]);

		if (!member) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription("Error details: `No user found`");
			return message.channel.send(errorEmbed);
		}

		if (member.id === message.author.id) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription("Error details: `You can't kick yourself`");
			return message.channel.send(errorEmbed);
		}

		if (member.id === "398264990567628812") {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`Error details: \`I am not able to kick my owner!\``
			);
			return message.channel.send(errorEmbed);
		}

		if (member.id === client.user.id) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`Error details: \`I am not able to kick myself\``
			);
			return message.channel.send(errorEmbed);
		}

		let reason = args.slice(1).join(" ");

		if (!reason) reason = "No reason given.";

		try {
			const dmEmbed = BaseEmbed(client, message, this)
				.setTitle(`Moderation notification`)
				.setDescription(`You have been kicked from ${message.guild.name}`)
				.addField(
					"Moderator",
					`${message.author.username}#${message.author.discriminator}`
				)
				.addField("Reason", `${reason}`)
				.addField("Date", `${message.createdAt.toLocaleString()}`);
			member.send(dmEmbed);
		} catch (e) {
			console.log(e);

			const errEmbed = await BaseErrorEmbed(client, message, self);
			errEmbed.setDescription(
				`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
			);
		}

		try {
			member.kick({ reason: reason });
		} catch (e) {
			console.log(e);

			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`Error details: \`Unable to kick ${member.user.username}\``
			);
			return message.channel.send(errorEmbed);
		}

		const caseNumber = await getCaseNumber(message.guild.id, this.connection);

		const modlog = await fetchModlog(this.connection, message.guild.id);
		const publicmodlog = await fetchPublicModlog(
			this.connection,
			message.guild.id
		);

		const embed = BaseEmbed(client, message, this)
			.setTitle(`New moderation`)
			.setDescription(`Case number: \`${caseNumber}\``)
			.addField("Moderation:", `\`Kick\``)
			.addField("User", `<@${member.user.id}>`)
			.addField("Reason", `\`${reason}\``)
			.addField("Moderator", `<@${message.author.id}>`)
			.addField("Date", `\`${message.createdAt.toLocaleString()}\``);

		let mid;
		if (modlog == null) {
			mid = null;
		} else {
			let m = await client.channels.cache.get(modlog).send(embed);
			mid = m.id;
		}
		let pid;
		if (publicmodlog == null) {
			pid = null;
		} else {
			let p = await client.channels.cache.get(publicmodlog).send(embed);
			pid = p.id;
		}

		await insertModeration(
			message.guild.id,
			`kick`,
			caseNumber,
			message.author.id,
			this.connection,
			{
				user: member.user.id,
				modlog: mid,
				publicmodlog: pid,
				reason: reason,
				modlogId: modlog,
				publicmodlogId: publicmodlog,
				modDate: Date.now(),
				updatedAt: Date.now(),
				updatedBy: message.author.id,
			}
		);
	}
};
