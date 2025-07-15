const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const { inspect } = require("util");
const { BaseErrorEmbed } = require("../../utils/structures/functions");

// Enter command name and change class name to command name {command}
module.exports = class EvalCommand extends BaseCommand {
	constructor() {
		super(
			"eval",
			"owner",
			[],
			"<js code>",
			"Evaluate javascript code",
			"Owner",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["eval message.channel.send('hello')"],
			true,
			1000,
			true,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		const toEval = args.join(" ");

		const evaluated = inspect(eval(toEval, { depth: 0 }));

		try {
			if (toEval) {
				const hrStart = process.hrtime();
				let hrDiff;
				hrDiff = process.hrtime(hrStart);
				return message.channel.send(
					`✅ | Executed in ${hrDiff[0] > 0 ? ` ${hrDiff[0]}s` : ""}${
						hrDiff[1] / 1000000
					}ms. *\`\`\`js\n${evaluated}\n\`\`\``,
					{ maxlength: 1900 }
				);
			} else {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`\nError details: Cannot evaluate nothing\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}
		} catch (e) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: Error while evaluating ${e.message}\`\`\``
			);
			return message.channel.send(errorEmbed);
		}
	}
};
