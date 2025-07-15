const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");

module.exports = class TagCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"tag",
			"server utilities",
			[],
			"(option) (text)",
			"Manage all your tags with this command",
			"Moderators",
			["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_GUILD", "ADMINISTRATOR"],
			[],
			["tag help", "tag create", "tag delete"],
			true,
			2000,
			false,
			false,
			[],
			"wip"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const self = this;
		if (args[0].toLowerCase().includes("help")) {
			return await BaseHelpEmbed(client, message, self);
		}

		if (args[0].toLowerCase().includes("create")) {
			let creationEmbed = new MessageEmbed()
				.setTitle("Tag command")
				.setDescription(
					"What would you like the name of the tag to be? You have a minute to respond"
				)
				.setTimestamp()
				.setThumbnail(message.guild.iconURL({ dynamic: true }))
				.setFooter(
					`Tag command | ${client.user.username}`,
					client.user.displayAvatarURL({ dynamic: true })
				);
			message.channel.send(creationEmbed);

			channel
				.awaitMessages((msg) => msg.author.id === message.author.id, {
					max: 1,
					time: 60000,
					errors: ["time"],
				})
				.then((collected) => {
					const msg = collected.first();
					if (!msg) {
						return message.channel.send("No name specified, please try again!");
					}
				});
		}
	}
};
