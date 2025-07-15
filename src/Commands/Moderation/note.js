const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseHelpEmbed,
	BaseEmbed,
	BaseImageEmbed,
	BaseSuccessEmbed,
	BaseGeneratingEmbed,
} = require("../../utils/structures/functions");

module.exports = class NoteCommand extends (
	BaseCommand
) {
	constructor() {
		super(
			"note",
			"moderation",
			[],
			"",
			"Create a note on a mentioned user",
			"",
			[],
			[],
			[],
			true,
			3000,
			false,
			false,
			[],
			"WIP"
		);
		this.connection = StateManager.connection;
	}
	async run(client, message, args) {
		const user =
			message.guild.members.cache.find((u) => u.name === args[0]) ||
			message.guild.members.cache.find((u) => u.id === args[0]) ||
			message.mentions.members.first();

		if (!user) {
			const errorEmbed = BaseErrorEmbed(client, message, this).setDescription(
				`Error details: \`This user doesn't exist.\``
			);
			return message.channel.send(errorEmbed);
		}

		const note = args.slice(1).join(" ");

		if (!note) {
			const errorEmbed = BaseErrorEmbed(client, message, this).setDescription(
				`Error details: \`You are missing the note!\``
			);
			return message.channel.send(errorEmbed);
		}
	}
};
