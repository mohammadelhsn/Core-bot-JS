const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	red,
	green,
	purple_dark,
	purple_light,
	purple_medium,
	black,
	blue_dark,
	white,
	red_dark,
	red_light,
	orange,
	pink,
	aqua,
	gold,
	green_dark,
	green_light,
	cream,
	cyan,
} = require("../../../colours.json");
const {
	BaseEmbed,
	BaseErrorEmbed,
	BaseHelpEmbed,
} = require("../../utils/structures/functions");

module.exports = class ColourTestCommand extends BaseCommand {
	constructor() {
		super(
			"colour",
			"owner",
			[],
			"!colour (pre-defined colour|hex code)",
			"Test colours out on the embed ",
			"Owner",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[],
			["colour", "colour green_light", "colour #000000"],
			true,
			3000,
			true,
			false,
			[],
			"Working"
		);
	}
	async run(client, message, args) {
		if (!args[0]) {
			return await BaseHelpEmbed(client, message, this);
		} else if (args[0].toLowerCase().includes("red")) {
			const redEmbed = BaseEmbed(client, message, this)
				.setColor(red)
				.setTitle("Colour command")
				.addField("Colour", `\`Red\``)
				.addField("Hex code", `\`${red}\``);
			return message.channel.send(redEmbed);
		} else if (args[0].toLowerCase().includes("green")) {
			const greenEmbed = BaseEmbed(client, message, this)
				.setColor(green)
				.setTitle("Colour command")
				.addField("Colour", `\`Green\``)
				.addField("Hex code", `\`${green}\``);
			return message.channel.send(greenEmbed);
		} else if (args[0].toLowerCase().includes("dark purple")) {
			const purpleDarkEmbed = BaseEmbed(client, message, this)
				.setColor(purple_dark)
				.setTitle("Colour command")
				.addField("Colour", `\`Dark purple\``)
				.addField("Hex code", `\`${purple_dark}\``);
			return message.channel.send(purpleDarkEmbed);
		} else if (args[0].toLowerCase().includes("light purple")) {
			const purpleLightEmbed = BaseEmbed(client, message, this)
				.setColor(purple_light)
				.setTitle("Colour command")
				.addField("Colour", `\`Light purple\``)
				.addField("Hex code", `\`${purple_light}\``);
			return message.channel.send(purpleLightEmbed);
		} else if (args[0].toLowerCase().includes("medium purple")) {
			const purpleMediumEmbed = BaseEmbed(client, message, this)
				.setColor(purple_medium)
				.setTitle("Colour command")
				.addField("Colour", `\`Medium purple \``)
				.addField("Hex code", `\`${purple_medium}\``);
			return message.channel.send(purpleMediumEmbed);
		} else if (args[0].toLowerCase().includes("black")) {
			const blackEmbed = BaseEmbed(client, message, this)
				.setColor(black)
				.setTitle("Colour command")
				.addField("Colour", `\`Black\``)
				.addField("Hex code", `\`${black}\``);
			return message.channel.send(blackEmbed);
		} else if (args[0].toLowerCase().includes("dark blue")) {
			const blueDarkEmbed = BaseEmbed(client, message, this)
				.setColor(blue_dark)
				.setTitle("Colour command")
				.addField("Colour", `\`Dark blue\``)
				.addField("Hex code", `\`${blue_dark}\``);
			return message.channel.send(blueDarkEmbed);
		} else if (args[0].toLowerCase().includes("white")) {
			const whiteEmbed = BaseEmbed(client, message, this)
				.setColor(white)
				.setTitle("Colour command")
				.addField("Colour", `\`White\``)
				.addField("Hex code", `\`${white}\``);
			return message.channel.send(whiteEmbed);
		} else if (args[0].toLowerCase().includes("dark red")) {
			const redDark = BaseEmbed(client, message, this)
				.setColor(red_dark)
				.setTitle("Colour command")
				.addField("Colour", `\`Dark red\``)
				.addField("Hex code", `\`${red_dark}\``);
			return message.channel.send(redDark);
		} else if (args[0].toLowerCase().includes("light red")) {
			const redLightEmbed = BaseEmbed(client, message, this)
				.setColor(red_light)
				.setTitle("Colour command")
				.addField("Colour", `\`Light red\``)
				.addField("Hex code", `\`${red_light}\``);
			return message.channel.send(redLightEmbed);
		} else if (args[0].toLowerCase().includes("orange")) {
			const orangeEmbed = BaseEmbed(client, message, this)
				.setColor(orange)
				.setTitle("Colour command")
				.addField("Colour", `\`Orange\``)
				.addField("Hex code", `\`${orange}\``);
			return message.channel.send(orangeEmbed);
		} else if (args[0].toLowerCase().includes("pink")) {
			const pinkEmbed = BaseEmbed(client, message, this)
				.setColor(pink)
				.setTitle("Colour command")
				.addField("Colour", `\`Pink\``)
				.addField("Hex code", `\`${pink}\``);
			return message.channel.send(pinkEmbed);
		} else if (args[0].toLowerCase().includes("aqua")) {
			const aquaEmbed = BaseEmbed(client, message, this)
				.setColor(aqua)
				.setTitle("Colour command")
				.addField("Colour", `\`Aqua\``)
				.addField("Hex code", `\`${aqua}\``);
			return message.channel.send(aquaEmbed);
		} else if (args[0].toLowerCase().includes("gold")) {
			const goldEmbed = BaseEmbed(client, message, this)
				.setColor(gold)
				.setTitle("Colour command")
				.addField("Colour", `\`Gold\``)
				.addField("Hex code", `\`${gold}\``);
			return message.channel.send(goldEmbed);
		} else if (args[0].toLowerCase().includes("dark green")) {
			const greenDarkEmbed = BaseEmbed(client, message, this)
				.setColor(green_dark)
				.setTitle("Colour command")
				.addField("Colour", `\`Dark green\``)
				.addField("Hex code", `\`${green_dark}\``);
			return message.channel.send(greenDarkEmbed);
		} else if (args[0].toLowerCase().includes("light green")) {
			const greenLightEmbed = BaseEmbed(client, message, this)
				.setColor(green_light)
				.setTitle("Colour command")
				.addField("Colour", `\`Light green\``)
				.addField("Hex code", `\`${green_light}\``);
			return message.channel.send(greenLightEmbed);
		} else if (args[0].toLowerCase().includes("cream")) {
			const creamEmbed = BaseEmbed(client, message, this)
				.setColor(cream)
				.setTitle("Colour command")
				.addField("Colour", `\`Cream\``)
				.addField("Hex code", `\`${cream}\``);
			return message.channel.send(creamEmbed);
		} else if (args[0].toLowerCase().includes("cyan")) {
			const cyanEmbed = BaseEmbed(client, message, this)
				.setColor(cyan)
				.setTitle("Colour command")
				.addField("Colour", `\`Cyan\``)
				.addField("Hex code", `\`${cyan}\``);
			return message.channel.send(cyanEmbed);
		} else if (args[0].toLowerCase().includes("colours")) {
			const colourListEmbed = BaseEmbed(client, message, this)
				.setTitle("List of pre-defined colours")
				.setDescription(
					`Colours:\n-----------------\n\`red\`\n\`red_dark\`\n\`red_light\`\n\`green\`\n\`green_dark\`\n\`green_light\`\n\`purple_dark\`\n\`purple_light\`\n\`purple_medium\`\n\`black\`\n\`blue_dark\`\n\`cyan\`\n\`white\`\n\`orange\`\n\`pink\`\n\`aqua\`\n\`gold\`\n\`cream\``
				);
			return message.channel.send(colourListEmbed);
		} else {
			const newColour = args[0];
			if (!args[0].includes("#")) {
				const missingArgument = await BaseErrorEmbed(client, message, this);
				missingArgument.setDescription(
					`\`\`\`Error details: You must include a '#' for this to work properly.\`\`\``
				);
				const msg = await message.channel.send(missingArgument);
				return msg.delete({ timeout: 10000 });
			} else if (args[0].length > 10) {
				const incorrectUsage = await BaseErrorEmbed(client, message, this);
				incorrectUsage.setDescription(
					"```Error details: Argument must be a number```"
				);
				const msg = await message.channel.send(incorrectUsage);
				return msg.delete({ timeout: 10000 });
			}
			const newColourEmbed = BaseEmbed(client, message, this)
				.setColor(`${newColour}`)
				.setTitle(`New colour`)
				.setDescription(`This is how ${newColour} looks like on an embed.`);
			return message.channel.send(newColourEmbed);
		}
	}
};
