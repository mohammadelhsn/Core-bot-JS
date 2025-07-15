const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
	fetchModlog,
	fetchPublicModlog,
	getString,
	getLang,
	getCaseNumber,
	insertModeration,
} = require("../../utils/structures/functions");

module.exports = class BanCommand extends BaseCommand {
	constructor() {
		super(
			"ban",
			"moderation",
			["begone"],
			"<mention> (reason)",
			"Bans the mentioned user from the guild.",
			"Administrators",
			["BAN_MEMBERS", "ADMINISTRATOR", "SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["ban @Tech! raiding", "ban 398264990567628812 test"],
			true,
			1000,
			false,
			false,
			["BAN_MEMBERS", "ADMINISTRATOR"],
			"Working"
		);
		this.connection = StateManager.connection;
	}

	async run(client, message, args) {
		const self = this;
		const lang = await getLang(message.guild.id, this.connection);

		if (!message.member.hasPermission(["BAN_MEMBERS" || "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				"```Error details: You require BAN_MEMBERS or ADMINISTRATOR to use this command.```"
			);
			message.delete();
			const m = await message.channel.send(errorEmbed);
			return m.delete({ timeout: 10000 });
		}

		if (!message.guild.me.hasPermission(["BAN_MEMBERS" || "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				"```Error details: I require BAN_MEMBERS or ADMINISTRATOR to use this command.```"
			);
			message.delete();
			const m = await message.channel.send(errorEmbed);
			return m.delete({ timeout: 10000 });
		}

		const user =
			message.mentions.members.first() ||
			message.guild.members.cache.find((u) => u.id === args[0]) ||
			message.guild.members.cache.find((u) => u.name === args[0]) ||
			(await client.users.fetch(args[0]));
		let mention;
		if (user) {
			mention = user.id;
		}
		let reason = args.slice(1).join(" ");

		if (!mention) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				"```Error details: The mention you have provided is invalid.```"
			);
			message.delete();
			const m = await message.channel.send(errorEmbed);
			return m.delete({ timeout: 10000 });
		}

		if (mention === message.author.id) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription("```Error details: You can't ban yourself.```");
			const m = await message.channel.send(errorEmbed);
			message.delete();
			return m.delete({ timeout: 10000 });
		}
		if (mention === "398264990567628812") {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				"```Error details: I'm not allowed to ban my creator!```"
			);
			message.delete();
			const m = await message.channel.send(errorEmbed);
			return m.delete({ timeout: 10000 });
		}

		if (mention === client.user.id) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription("```Error details: I cannot ban myself!```");
			message.delete();
			const m = await message.channel.send(errorEmbed);
			return m.delete({ timeout: 10000 });
		}

		const banList = await message.guild.fetchBans();

		const userBanned = banList.find((usr) => usr.id === user.id);

		if (userBanned) {
			const eEmbed = await BaseErrorEmbed(client, message, this);
			eEmbed.setDescription("```Error details: This user is already banned```");
			message.delete();
			const m = await message.channel.send(eEmbed);
			return m.delete({ timeout: 10000 });
		} else {
			if (!reason) reason = "No reason given.";

			message.delete();

			let bannedEmbed = BaseEmbed(client, message, this)
				.setTitle("Moderation notification")
				.setDescription(
					`You have been banned fromm \`${message.guild.name}\` for \`${reason}\``
				);

			if (message.guild.member(mention)) {
				try {
					mention.send(bannedEmbed);
				} catch (error) {
					console.log(error);

					const errEmbed = await BaseErrorEmbed(client, message, self);
					errEmbed.setDescription(
						`\`\`\`Error details: An unexpected error occurred when trying to message this user\`\`\``
					);
					message.channel.send(errEmbed);
				}
			}

			try {
				message.guild.members.ban(mention, { days: 1, reason: reason });
			} catch (error) {
				console.log(error);

				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
				return message.channel.send(errEmbed);
			}

			const successEmbed = await BaseSuccessEmbed(client, message, this);
			successEmbed.setDescription(
				`<@${mention}> was banned for \`${reason}\`!`
			);
			message.channel.send(successEmbed).then((msg) => {
				msg.delete({ timeout: 10000 });
			});

			const caseNumber = await getCaseNumber(message.guild.id, this.connection);

			const modlogEmbed = BaseEmbed(client, message, this)
				.setTitle("New moderation")
				.setDescription("Moderation: `Ban`")
				.addField("User", `<@${user.id}>`)
				.addField("Moderator", `<@${message.author.id}>`)
				.addField("Reason", `\`${reason}\``)
				.addField("Date", `\`${message.createdAt.toLocaleString()}\``)
				.addField("Case number", `\`${caseNumber}\``);

			const modlog = await fetchModlog(this.connection, message.guild.id);
			const publicmodlog = await fetchPublicModlog(
				this.connection,
				message.guild.id
			);

			let mid;
			if (modlog == null) {
				mid = null;
			} else {
				let m = await client.channels.cache.get(modlog).send(modlogEmbed);
				mid = m.id;
			}
			let pid;
			if (publicmodlog == null) {
				pid = null;
			} else {
				let p = await client.channels.cache.get(publicmodlog).send(modlogEmbed);
				pid = p.id;
			}

			try {
				await insertModeration(
					message.guild.id,
					"ban",
					caseNumber,
					message.author.id,
					this.connection,
					{
						user: user.id,
						modlog: mid,
						publicmodlog: pid,
						reason: reason,
						modlogId: modlog,
						publicmodlogId: publicmodlog,
						moderationDate: Date.now(),
						updatedAt: Date.now(),
						updatedBy: message.author.id,
					}
				);
			} catch (error) {
				console.log(error);

				const errEmbed = await BaseErrorEmbed(client, message, self);
				errEmbed.setDescription(
					`\`\`\`Error details: ${getString(lang, "unexpected_error")}\`\`\``
				);
				return message.channel.send(errEmbed);
			}
		}
	}
};
