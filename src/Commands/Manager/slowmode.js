const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
	BaseErrorEmbed,
	BaseSuccessEmbed,
} = require("../../utils/structures/functions");

module.exports = class SlowmodeCommand extends BaseCommand {
	constructor() {
		super(
			"slowmode",
			"manager",
			["sm"],
			"",
			"Set the slowmode for a channel",
			"",
			[],
			[],
			[],
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
		if (!message.member.hasPermission(["MANAGE_CHANNELS" || "ADMINISTRATOR"])) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: You don't have the correct permissions to use this command\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		if (
			!message.guild.me.hasPermission(["MANAGE_CHANNELS" || "ADMINISTRATOR"])
		) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: I don't have the permissions to fulfill the commands for you!\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		const channel = message.mentions.channels.first() || message.channel;

		if (channel.type !== "text") {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: The channel you mentioned isn't a text channel!\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		let duration = args[1];
		let reason;

		if (!args[0]) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: Channel/duration is a required argument\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		if (!args[0].includes(channel)) {
			duration = args[0];
			reason = args.slice(1).join(" ");
		} else {
			reason = args.slice(2).join(" ");
		}

		if (!reason) reason = "No reason given.";

		if (isNaN(duration) === true) {
			if (duration.toLowerCase().includes("off")) {
				duration = 0;
			} else {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`Error details: Include 'off' or an actual number.\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
		}

		if (channel.rateLimitPerUser === duration) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: Slowmode is already set to ${
					duration === 0 ? "off" : `${duration}(s)`
				}\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}

		try {
			channel.setRateLimitPerUser(duration, reason);
		} catch (e) {
			console.log(e);

			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: An error occurred when trying to set slowmode time.\`\`\``
			);
			return message.channel.send(errorEmbed);
		}

		const successEmbed = await BaseSuccessEmbed(client, message, this);
		successEmbed.setDescription(
			`Successfully set <#${channel.id}> cooldown to ${
				duration === 0 ? "`off`" : `\`${duration}\`(s)`
			}`
		);
		message.channel.send(successEmbed).then((msg) => {
			msg.delete({ timeout: 10000 });
		});
		// replace with fetchActionLog and clean up
		const res = await this.connection.query(
			`SELECT actionLogId FROM GuildLogging WHERE guildId = '${message.guild.id}'`
		);
		const logEmbed = BaseEmbed(client, message, this)
			.setTitle(`New action`)
			.setDescription(
				`Action: Slowmode \`${duration === 0 ? "disabled" : "enabled"}\``
			)
			.addField(
				"Duration",
				`${duration === 0 ? "`off`" : `\`${duration}\`(s)`}`
			)
			.addField("Channel", `<#${channel.id}>`)
			.addField("Author", `<@${message.author.id}>`)
			.addField("Date", `\`${message.createdAt.toLocaleString()}\``);

		const actionlog = res[0][0].actionLogId;
		if (actionlog !== null || actionlog !== "null" || actionlog !== undefined) {
			return client.channels.cache.get(actionlog).send(logEmbed);
		}
	}
};
