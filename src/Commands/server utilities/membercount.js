const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");

module.exports = class MemberCountCommand extends BaseCommand {
	constructor() {
		super(
			"membercount",
			"server utilities",
			["mc"],
			"(option)",
			"Gives the guilds membercount",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["membercount help` - Sends help embed"],
			["membercount", "membercount help"],
			true,
			3000,
			false,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		const membercount = {
			membercount: `${message.guild.memberCount}`,
			humanCount: `${
				message.guild.members.cache.filter((member) => !member.user.bot).size
			}`,
			botCount: `${
				message.guild.members.cache.filter((member) => member.user.bot).size
			}`,
			online: `${
				message.guild.members.cache.filter(
					(o) => o.presence.status === "online"
				).size
			}`,
			idle: `${
				message.guild.members.cache.filter((i) => i.presence.status === "idle")
					.size
			}`,
			dnd: `${
				message.guild.members.cache.filter(
					(dnd) => dnd.presence.status === "dnd"
				).size
			}`,
			offline: `${
				message.guild.members.cache.filter(
					(off) => off.presence.status === "offline"
				).size
			}`,
			streaming: `${
				message.guild.members.cache.filter(
					(s) => s.presence.status === "streaming"
				).size
			}`,
			guild: `${message.guild.name}`,
		};

		if (!args[0]) {
			const embed = await this.Embed.Base({
				client: client,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				command: this,
				title: "Membercount command",
				description: `${membercount.guild} membercount!`,
				fields: [
					{
						name: "Total membercount",
						value: `\`${this.Utils.formatNumber(membercount.membercount)}\``,
					},
					{
						name: "Human count",
						value: `\`${this.Utils.formatNumber(membercount.humanCount)}\``,
					},
					{
						name: `${this.Emojis.bot_emoji} | Bot count`,
						value: `\`${this.Utils.formatNumber(membercount.botCount)}\``,
					},
					{
						name: `${this.Emojis.online_emoji} | Members online`,
						value: `\`${this.Utils.formatNumber(membercount.online)}\``,
					},
					{
						name: `${this.Emojis.idle_emoji} | Idle members`,
						value: `\`${this.Utils.formatNumber(membercount.idle)}\``,
					},
					{
						name: `${this.Emojis.dnd_emoji} | DND members`,
						value: `\`${this.Utils.formatNumber(membercount.dnd)}\``,
					},
					{
						name: `${this.Emojis.offline_emoji} | Offline/invisible members`,
						value: `\`${this.Utils.formatNumber(membercount.offline)}\``,
					},
					{
						name: `${this.Emojis.streaming_emoji} | Members streaming`,
						value: `\`${this.Utils.formatNumber(membercount.streaming)}\``,
					},
				],
			});

			return message.channel.send({ embed: embed });
		} else {
			return await BaseHelpEmbed(client, message, this);
		}
	}
};
