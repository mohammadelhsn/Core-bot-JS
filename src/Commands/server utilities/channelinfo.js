const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");

module.exports = class ChannelInfoCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"channelinfo",
			"server utilities",
			["ci"],
			"(mention)",
			"Gives mentioned or current channel info",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["channelinfo", "channelinfo #rules"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const channel =
			message.mentions.channels.first() ||
			message.guild.channels.cache.find((c) => c.name === args[0]) ||
			message.guild.channels.cache.find((c) => c.id === args[0]);

		if (!channel) {
			const channel = message.channel;

			const channelinfo = {};
			channelinfo.name = channel.name;
			channelinfo.id = channel.id;
			channelinfo.guild = channel.guild;
			channelinfo.type = channel.type;
			channelinfo.createdAt = channel.createdAt;
			channelinfo.deleted = `${message.channel.deleted ? "Yes" : "No"}`;
			channelinfo.nsfw = `${message.channel.nsfw ? "Yes" : "No"}`;

			const currentChannelInfo = BaseEmbed(client, message, this)
				.setTitle(`${channel.guild} Channelinfo`)
				.setDescription(`<#${channel.id}>`)
				.addField("Channel name:", `\`${channelinfo.name}\``, true)
				.addField("Channel type", `\`${channelinfo.type}\``, true)
				.addField("Deleted?", `\`${channelinfo.deleted}\``, true)
				.addField("NSFW?", `\`${channelinfo.nsfw}\``, true)
				.addField("Channel created at", `\`${channelinfo.createdAt}\``);
			return message.channel.send(currentChannelInfo);
		} else if (args[0].toLowerCase().includes("help")) {
			return await BaseHelpEmbed(client, message, this);
		} else {
			const channelinfo = {};
			channelinfo.name = channel.name;
			channelinfo.id = channel.id;
			channelinfo.guild = channel.guild;
			channelinfo.type = channel.type;
			channelinfo.createdAt = channel.createdAt;
			channelinfo.deleted = `${message.channel.deleted ? "Yes" : "No"}`;
			channelinfo.nsfw = `${message.channel.nsfw ? "Yes" : "No"}`;

			const mentionedChannelInfo = BaseEmbed(client, message, this)
				.setTitle(`${channelinfo.guild} channelinfo`)
				.setDescription(`<#${channel.id}>`)
				.addField("Channel name:", `\`${channelinfo.name}\``, true)
				.addField("Channel type", `\`${channelinfo.type}\``, true)
				.addField("Deleted?", `\`${channelinfo.deleted}\``, true)
				.addField("NSFW?", `\`${channelinfo.nsfw}\``, true)
				.addField("Channel created at", `\`${channelinfo.createdAt}\``);
			return message.channel.send(mentionedChannelInfo);
		}
	}
};
