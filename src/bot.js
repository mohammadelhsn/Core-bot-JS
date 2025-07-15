require("dotenv").config();
const { Client } = require("discord.js");
const { Manager } = require("erela.js");
const {
	registerCommands,
	registerEvents,
	registerMusicEvents,
} = require("./utils/register");
const client = new Client({ retryLimit: 5 });
let connection;
client.cooldown = new Map();
client.commands = new Map();
client.events = new Map();
client.aliases = new Map();
guildCommandPrefixes = new Map();

client.on("raw", (d) => client.manager.updateVoiceState(d));

client.login(process.env.BOT_TOKEN);
client.manager = new Manager({
	nodes: [
		{
			host: process.env.HOST,
			port: parseInt(process.env.PORT),
			password: process.env.PASSWORD,
		},
	],
	send(id, payload) {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	},
});
registerCommands(client, "../commands");
registerEvents(client, "../events");
registerMusicEvents(client, "../music");

async function initConnection() {
	connection = await require("../Database/DB");
}
initConnection();
