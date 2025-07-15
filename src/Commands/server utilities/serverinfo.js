const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");

module.exports = class ServerInfoCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"serverinfo",
			"server utilities",
			["si", "sii"],
			"(help)",
			"Shows the information in the current guild",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["serverinfo help`"],
			["serverinfo", "serverinfo help"],
			true,
			2000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const serverinfo = {
			name: `${message.guild.name}`,
			id: `${message.guild.id}`,
			owner: `${message.guild.owner}`,
			ownerid: `${message.guild.ownerID}`,
			region: `${message.guild.region}`,
			available: `\`${message.guild.available ? "Yes" : "No"}\``,
			large: `\`${message.guild.large ? "Yes" : "No"}\``,
			partnered: `\`${message.guild.partnered ? "Yes" : "No"}\``,
			verified: `\`${message.guild.verified ? "Yes" : "No"}\``,
			membercount: `\`${message.guild.memberCount}\``,
			humans: `\`${
				message.guild.members.cache.filter((member) => !member.user.bot).size
			}\``,
			bots: `\`${
				message.guild.members.cache.filter((member) => member.user.bot).size
			}\``,
			totalChannels: `\`${message.guild.channels.cache.size}\``,
			textChannels: `\`${
				message.guild.channels.cache.filter((ch) => ch.type === "text").size
			}\``,
			voiceChannels: `\`${
				message.guild.channels.cache.filter((ch) => ch.type === "voice").size
			}\``,
			contentFilter: `\`${message.guild.explicitContentFilter}\``,
			verificationlvl: `\`${message.guild.verificationLevel}\``,
			createdAt: `\`${message.guild.createdAt}\``,
			boostCount: `\`${message.guild.premiumSubscriptionCount}\``,
			boostTier: `\`${message.guild.premiumTier}\``,
			roleCount: `\`${message.guild.roles.cache.size}\``,
			roles: `\`${message.guild.roles.cache
				.map((role) => role.toString())
				.join(" ")}\``,
		};

		if (args[0]) {
			if (args[0].toLowerCase().includes("help")) {
				return await this.HelpEmbed.Base({
					client: client, 
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					command: this,
					message: message
				})
			}
		} else {
			const serverinfoEmbed = await this.Embed.Base({
				client: client, 
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				title: `Serverinfo command`,
				description: `${serverinfo.name}`,
				fields: [
					{ name: "ID", value: `${serverinfo.id}`},
					{ name: "Server owner:", value: `${serverinfo.owner}`},
					{ name: "Server owner ID:", value: `${serverinfo.ownerid}`},
					{ name: "Server region:", value: `${serverinfo.region}`},
					{ name: "Created at:", value: `${serverinfo.createdAt}`},
					{ name: "Total channels", value: `${serverinfo.totalChannels}`},
					{ name: "Text channels", value: `${serverinfo.textChannels}`},
					{ name: "Voice channels", value: `${serverinfo.voiceChannels}`},
					{ name: "Membercount", value: `${serverinfo.membercount}`},
					{ name: "Human count", value: `${serverinfo.humans}`},
					{ name: "Bot count", value: `${serverinfo.bots}`}
				]
			})
			return message.channel.send(serverinfoEmbed);
		}
	}
};
