const BaseCommand = require("../../utils/structures/BaseCommand");
const StateManager = require("../../utils/StateManager");
const { MessageEmbed } = require("discord.js");
const api = require("novelcovid");
const axios = require("axios");
const dateFormat = require("dateformat");
const pagination = require("discord.js-pagination");
const {
	BaseEmbed,
	BaseErrorEmbed,
} = require("../../utils/structures/functions");

module.exports = class CovidCommand extends BaseCommand {
	constructor() {
		super(
			"covid",
			"miscellaneous",
			["corona"],
			"(region || country || place || vaccine) (country name || region name || place name)",
			"Look for COVID stats in country/regions/worldwide",
			"",
			["SEND_MESSAGES", "EMBED_LINKS"],
			[
				"covid region` - Gets data on a certain region",
				"covid country` - Gets data on a certain country",
				"covid place` - Get the data on a certain city/place [US ONLY]",
				"covid vaccine` Get the vaccine numbers [CANADA ONLY]",
			],
			["covid", "covid region Ontario Canada", "covid country Canada"],
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
		const lang = await this.Translator.getLang(message.guild.id);
		const self = this;
		const choice = args[0];
		const q = args.slice(1).join("-");

		if (!choice) {
			try {
				const res = await api.all();

				const covid = {};
				covid.updatedAt = dateFormat(
					res.updated,
					"dddd, mmmm dS yyyy, h:MM:ss TT"
				);
				covid.cases = `\`${self.Utils.formatNumber(res.cases)}\``;
				covid.deaths = `\`${self.Utils.formatNumber(res.deaths)}\``;
				covid.recovered = `\`${self.Utils.formatNumber(res.recovered)}\``;
				covid.active = `\`${self.Utils.formatNumber(res.active)}\``;
				covid.critical = `\`${self.Utils.formatNumber(res.critical)}\``;
				covid.tests = `\`${self.Utils.formatNumber(res.tests)}\``;
				covid.todayCases = `\`${self.Utils.formatNumber(res.todayCases)}\``;
				covid.todayDeaths = `\`${self.Utils.formatNumber(res.todayDeaths)}\``;
				covid.todayRecovered = `\`${self.Utils.formatNumber(
					res.todayRecovered
				)}\``;
				covid.casesPerM = `\`${self.Utils.formatNumber(
					res.casesPerOneMillion
				)}\``;
				covid.deathsPerM = `\`${self.Utils.formatNumber(
					res.deathsPerOneMillion
				)}\``;
				covid.testsPerM = `\`${self.Utils.formatNumber(
					res.testsPerOneMillion
				)}\``;
				covid.population = `\`${self.Utils.formatNumber(res.population)}\``;

				return message.channel.send({
					embed: this.Embed.Base({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						command: self,
						title: `Covid command | Stats`,
						description: `Location: \`Worldwide\` | Population: ${covid.population}`,
						fields: [
							{ name: "Last updated at:", value: `\`${covid.updatedAt}\`` },
							{
								name: "Today stats",
								value: `Cases: ${covid.todayCases}\nDeaths: ${covid.todayDeaths}\nRecovered: ${covid.todayRecovered}`,
							},
							{
								name: "Total stats",
								value: `Cases: ${covid.cases}\nDeaths: ${covid.deaths}\nRecovered: ${covid.recovered}\nActive: ${covid.active}\nCritical: ${covid.critical}\nTests: ${covid.tests}`,
							},
							{
								name: "Per million stats",
								value: `Cases: ${covid.casesPerM}\nDeaths: ${covid.deathsPerM}\nTests: ${covid.testsPerM}`,
							},
						],
					}),
				});
			} catch (e) {
				console.log(e);

				return message.channel.send(
					await this.ErrorEmbed.UnexpectedError({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						command: self,
					})
				);
			}
		} else {
			if (choice.toLowerCase() === "country") {
				const stats = [];
				const embeds = [];
				try {
					axios
						.get(
							"https://coviddata.github.io/coviddata/v1/countries/stats.json"
						)
						.then(async (response) => response.data)
						.then(async (data) => {
							const country = data.find(
								(region) => region.country.key == q.toLowerCase()
							);
							if (!country || country == undefined) {
								const errorEmbed = await BaseErrorEmbed(client, message, self);
								errorEmbed.setDescription(
									"```Error details: No results found!```"
								);
								const msg = await message.channel.send(errorEmbed);
								return msg.delete({ timeout: 10000 });
							}
							let date;
							for (date in country.dates) {
								const obj = {
									date: date,
									new: {
										cases: country.dates[date].new.cases,
										deaths: country.dates[date].new.deaths,
										recoveries: country.dates[date].new.recoveries,
									},
									cumulative: {
										cases: country.dates[date].cumulative.cases,
										deaths: country.dates[date].cumulative.deaths,
										recoveries: country.dates[date].cumulative.recoveries,
									},
								};
								stats.push(obj);
							}
							const reversed = stats.reverse();
							const response = await api.countries({
								country: args.slice(1).join(" "),
							});
							reversed.forEach((e) => {
								embeds.push(
									new MessageEmbed()
										.setAuthor(
											client.user.username,
											message.author.displayAvatarURL({ dynamic: true })
										)
										.setTitle(country.country.name)
										.setDescription(
											`${this.Utils.capitalize(
												this.Translator.getString(lang, "provided_by")
											)}: \`Covid data API\``
										)
										.setTimestamp()
										.setThumbnail(response.countryInfo.flag)
										.addField("Date", `\`${e.date}\``)
										.addField(
											"Cases",
											`New: \`${self.Utils.formatNumber(
												e.new.cases
											)}\`\nTotal: \`${self.Utils.formatNumber(
												e.cumulative.cases
											)}\``
										)
										.addField(
											"Deaths",
											`New: \`${self.Utils.formatNumber(
												e.new.deaths
											)}\`\nTotal: \`${self.Utils.formatNumber(
												e.cumulative.deaths
											)}\``
										)
										.addField(
											"Recoveries",
											`New: \`${self.Utils.formatNumber(
												e.new.recoveries
											)}\`\nTotal: \`${self.Utils.formatNumber(
												e.cumulative.recoveries
											)}\``
										)
										.setColor(this.Colour.set())
										.setFooter(
											"Hello",
											message.author.displayAvatarURL({ dynamic: true })
										)
								);
							});
							return pagination(message, embeds, ["⬅️", "➡️"], 600000);
						});
				} catch (e) {
					console.log(e);

					return message.channel.send(
						await this.ErrorEmbed.UnexpectedError({
							client: client,
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							id: message.guild.id,
							command: self,
						})
					);
				}
			} else if (choice.toLowerCase() === "region") {
				const stats = [];
				const embeds = [];
				try {
					axios
						.get("https://coviddata.github.io/coviddata/v1/regions/stats.json")
						.then(async (response) => response.data)
						.then(async (data) => {
							const country = data.find(
								(region) => region.region.key == q.toLowerCase()
							);

							if (!country || country == undefined) {
								const errorEmbed = await BaseErrorEmbed(client, message, self);
								errorEmbed.setDescription(
									"```Error details: No results found```"
								);
								const msg = await message.channel.send(errorEmbed);
								return msg.delete({ timeout: 10000 });
							}
							let date;
							for (date in country.dates) {
								const obj = {
									date: date,
									new: {
										cases: country.dates[date].new.cases,
										deaths: country.dates[date].new.deaths,
										recoveries: country.dates[date].new.recoveries,
									},
									cumulative: {
										cases: country.dates[date].cumulative.cases,
										deaths: country.dates[date].cumulative.deaths,
										recoveries: country.dates[date].cumulative.recoveries,
									},
								};
								stats.push(obj);
							}
							const reversed = stats.reverse();
							reversed.forEach((e) => {
								embeds.push(
									new MessageEmbed()
										.setAuthor(
											client.user.username,
											message.author.displayAvatarURL({ dynamic: true })
										)
										.setTitle(country.region.full_name)
										.setDescription(
											`${this.Utils.capitalize(
												this.Translator.getString(lang, "provided_by")
											)}: \`Covid data API\``
										)
										.setTimestamp()
										.setThumbnail(
											message.author.displayAvatarURL({ dynamic: true })
										)
										.addField("Date", `\`${e.date}\``)
										.addField(
											"Cases",
											`New: \`${self.Utils.formatNumber(
												e.new.cases
											)}\`\nTotal: \`${self.Utils.formatNumber(
												e.cumulative.cases
											)}\``
										)
										.addField(
											"Deaths",
											`New: \`${self.Utils.formatNumber(
												e.new.deaths
											)}\`\nTotal: \`${self.Utils.formatNumber(
												e.cumulative.deaths
											)}\``
										)
										.addField(
											"Recoveries",
											`New: \`${self.Utils.formatNumber(
												e.new.recoveries
											)}\`\nTotal: \`${self.Utils.formatNumber(
												e.cumulative.recoveries
											)}\``
										)
										.setColor(this.Colour.set())
										.setFooter(
											"Hello",
											message.author.displayAvatarURL({ dynamic: true })
										)
								);
							});
							return pagination(message, embeds, ["⬅️", "➡️"], 600000);
						});
				} catch (e) {
					console.log(e);

					return await this.ErrorEmbed.UnexpectedError({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						command: self,
					});
				}
			} else if (choice.toLowerCase() == "place") {
				// https://coviddata.github.io/coviddata/v1/places/stats.json
				try {
					const stats = [];
					axios
						.get("https://coviddata.github.io/coviddata/v1/places/stats.json")
						.then(async (response) => response.data)
						.then(async (data) => {
							const place = data.filter((p) =>
								p.place.key.includes(q.toLowerCase())
							)[0];

							if (!place || place.length == 0 || place == undefined) {
								return message.channel.send(
									await self.ErrorEmbed.NoResult({
										client: client,
										iconURL: message.author.displayAvatarURL({ dynamic: true }),
										id: message.guild.id,
										command: self,
									})
								);
							}

							for (let date in place.dates) {
								const obj = {
									date: date,
									new: {
										cases: place.dates[date].new.cases,
										deaths: place.dates[date].new.deaths,
										recoveries: place.dates[date].new.recoveries,
									},
									cumulative: {
										cases: place.dates[date].cumulative.cases,
										deaths: place.dates[date].cumulative.deaths,
										recoveries: place.dates[date].cumulative.recoveries,
									},
								};
								stats.push(obj);
							}
							const reversed = stats.reverse();
							const embeds = [];
							reversed.forEach(async (e) => {
								embeds.push(
									new MessageEmbed()
										.setAuthor(
											client.user.username,
											message.author.displayAvatarURL({ dynamic: true })
										)
										.setTitle(place.place.full_name)
										.setDescription(
											`${this.Utils.capitalize(
												this.Translator.getString(lang, "provided_by")
											)}: \`Covid data API\``
										)
										.setTimestamp()
										.setColor(this.Colour.set())
										.addField("Date", `\`${e.date}\``)
										.addField(
											"Cases",
											`New: \`${e.new.cases}\`\nTotal: \`${e.cumulative.cases}\``
										)
										.addField(
											"Deaths",
											`New: \`${e.new.deaths}\`\nTotal: \`${e.cumulative.deaths}\``
										)
										.addField(
											"Recoveries",
											`New: \`${e.new.recoveries}\`\nTotal: \`${e.cumulative.recoveries}\``
										)
										.setFooter(
											"Hello",
											message.author.displayAvatarURL({ dynamic: true })
										)
								);
							});
							return pagination(message, embeds, ["⬅️", "➡️"], 600000);
						});
				} catch (e) {
					console.log(e);

					return message.channel.send(
						await self.ErrorEmbed.UnexpectedError({
							client: client,
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							id: message.guild.id,
							command: self,
						})
					);
				}
			} else if (choice.toLowerCase() == "vaccine") {
				// https://api.covid19tracker.ca/docs/1.0/overview
				try {
					const res = await axios.get(`https://api.covid19tracker.ca/summary`);
					const data = res.data;

					return message.channel.send({
						embed: this.Embed.Base({
							client: client,
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							command: self,
							title: "Covid command | Vaccines",
							description: `Location: \`Canada\``,
							fields: [
								{
									name: "Latest date:",
									value: `\`${data.data[0].latest_date}\``,
								},
								{
									name: "Last updated",
									value: `\`${data.last_updated}\``,
								},
								{
									name: "New Vaccinations:",
									value: `\`${this.Utils.formatNumber(
										data.data[0].change_vaccinations
									)}\``,
								},
								{
									name: "New Vaccinated:",
									value: `\`${this.Utils.formatNumber(
										data.data[0].change_vaccinated
									)}\``,
								},
								{
									name: "New vaccines distributed:",
									value: `\`${this.Utils.formatNumber(
										data.data[0].change_vaccines_distributed
									)}\``,
								},
								{
									name: "Total vaccinations:",
									value: `\`${this.Utils.formatNumber(
										data.data[0].total_vaccinations
									)}\``,
								},
								{
									name: "Total vaccinated:",
									value: `\`${this.Utils.formatNumber(
										data.data[0].total_vaccinated
									)}\``,
								},
								{
									name: "Total vaccines distributed:",
									value: `\`${this.Utils.formatNumber(
										data.data[0].total_vaccines_distributed
									)}\``,
								},
							],
						}),
					});
				} catch (e) {
					console.log(e);

					return message.channel.send(
						await this.ErrorEmbed.UnexpectedError({
							client: client,
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							id: message.guild.id,
							command: self,
						})
					);
				}
			} else {
				const res = await api.all();

				const covid = {};
				covid.updatedAt = dateFormat(
					res.updated,
					"dddd, mmmm dS yyyy, h:MM:ss TT"
				);
				covid.cases = `\`${self.Utils.formatNumber(res.cases)}\``;
				covid.deaths = `\`${self.Utils.formatNumber(res.deaths)}\``;
				covid.recovered = `\`${self.Utils.formatNumber(res.recovered)}\``;
				covid.active = `\`${self.Utils.formatNumber(res.active)}\``;
				covid.critical = `\`${self.Utils.formatNumber(res.critical)}\``;
				covid.tests = `\`${self.Utils.formatNumber(res.tests)}\``;
				covid.todayCases = `\`${self.Utils.formatNumber(res.todayCases)}\``;
				covid.todayDeaths = `\`${self.Utils.formatNumber(res.todayDeaths)}\``;
				covid.todayRecovered = `\`${self.Utils.formatNumber(
					res.todayRecovered
				)}\``;
				covid.casesPerM = `\`${self.Utils.formatNumber(
					res.casesPerOneMillion
				)}\``;
				covid.deathsPerM = `\`${self.Utils.formatNumber(
					res.deathsPerOneMillion
				)}\``;
				covid.testsPerM = `\`${self.Utils.formatNumber(
					res.testsPerOneMillion
				)}\``;
				covid.population = `\`${self.Utils.formatNumber(res.population)}\``;

				return message.channel.send({
					embed: this.Embed.Base({
						client: client,
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						command: self,
						title: `Covid command | Stats`,
						description: `Location: \`Worldwide\` | Population: ${covid.population}`,
						fields: [
							{ name: "Last updated at:", value: `\`${covid.updatedAt}\`` },
							{
								name: "Today stats",
								value: `Cases: ${covid.todayCases}\nDeaths: ${covid.todayDeaths}\nRecovered: ${covid.todayRecovered}`,
							},
							{
								name: "Total stats",
								value: `Cases: ${covid.cases}\nDeaths: ${covid.deaths}\nRecovered: ${covid.recovered}\nActive: ${covid.active}\nCritical: ${covid.critical}\nTests: ${covid.tests}`,
							},
							{
								name: "Per million stats",
								value: `Cases: ${covid.casesPerM}\nDeaths: ${covid.deathsPerM}\nTests: ${covid.testsPerM}`,
							},
						],
					}),
				});
			}
		}
	}
};
