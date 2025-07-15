const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const {
	BaseErrorEmbed,
	BaseImageEmbed,
	BaseSuccessEmbed,
} = require("../../utils/structures/functions");
const weather = require("weather-js");

module.exports = class WeatherCommand extends BaseCommand {
	constructor() {
		super(
			"weather",
			"miscellaneous",
			["temperature", "temp"],
			"<city>",
			"Get the weather in an area",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			["weather help` - Sends the help embed"],
			["weather toronto", "weather help"],
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
		const self = this;

		const city = args.join(" ");
		if (!city) {
			const errorEmbed = await BaseErrorEmbed(client, message, this);
			errorEmbed.setDescription(
				`\`\`\`Error details: Please mention a city!\`\`\``
			);
			const msg = await message.channel.send(errorEmbed);
			return msg.delete({ timeout: 10000 });
		}
		weather.find({ search: city, degreeType: "C" }, async function (err, res) {
			if (err) {
				console.log(err);

				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(`\`\`\`Error details: Unknown error\`\`\``);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			if (!res || res.length === "0" || res.length === 0) {
				const errorEmbed = await BaseErrorEmbed(client, message, this);
				errorEmbed.setDescription(
					`\`\`\`Error details: No results for ${city}\`\`\``
				);
				const msg = await message.channel.send(errorEmbed);
				return msg.delete({ timeout: 10000 });
			}

			if (res.length > 1) {
				let index = 1;
				let string = "";
				string += `**Please pick from one of the following**\n${res
					.slice(0, 10)
					.map((x) => `**${index++}**) \`${x.location.name}\``)
					.join("\n")}`;
				const embed = await BaseErrorEmbed(client, message, self);
				embed.setTitle(`Oops, there are multiple locations!`);
				embed.setDescription(string);
				const mesg = await message.channel.send(embed);
				mesg.delete({ timeout: 35000 });

				const collector = message.channel.createMessageCollector(
					(m) => {
						return (
							m.author.id === message.author.id &&
							new RegExp("^([1-5|cancel])$", "i").test(m.content)
						);
					},
					{ time: 30000, max: 1 }
				);

				collector.on("collect", (m) => {
					if (/cancel/i.test(m.content)) return collector.stop("cancelled");

					const region = res[Number(m.content) - 1];

					const weatherEmbed = BaseImageEmbed(client, message, self)
						.setTitle(`Weather command`)
						.setDescription(`Location: \`${region.location.name}\``)
						.addField("Temperature", `\`${region.current.temperature}°C\``)
						.addField("Sky text", `\`${region.current.skytext}\``)
						.addField("Humidity", `\`${region.current.humidity}\``)
						.addField("Wind speed", `\`${region.current.windspeed}\``)
						.addField(
							"Observation time:",
							`\`${region.current.observationtime}\``
						)
						.addField("Wind display", `\`${region.current.winddisplay}\``)
						.setThumbnail(region.current.imageUrl);
					return message.channel.send(weatherEmbed);
				});

				collector.on("end", async (_, reason) => {
					if (["time", "cancelled"].includes(reason)) {
						const embed = await BaseSuccessEmbed(client, message, this);
						embed.setDescription(`Successfully cancelled selection!`);
						return message.channel.send(embed);
					}
				});
			} else {
				const weatherEmbed = BaseImageEmbed(client, message, this)
					.setTitle(`Weather command`)
					.setDescription(`Location: \`${res[0].location.name}\``)
					.addField("Temperature", `\`${res[0].current.temperature}°C\``)
					.addField("Sky text", `\`${res[0].current.skytext}\``)
					.addField("Humidity", `\`${res[0].current.humidity}\``)
					.addField("Wind speed", `\`${res[0].current.windspeed}\``)
					.addField(
						"Observation time:",
						`\`${res[0].current.observationtime}\``
					)
					.addField("Wind display", `\`${res[0].current.winddisplay}\``)
					.setThumbnail(res[0].current.imageUrl);
				return message.channel.send(weatherEmbed);
			}
		});
	}
};
