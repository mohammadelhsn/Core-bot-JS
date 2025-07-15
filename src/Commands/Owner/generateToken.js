const BaseCommand = require('../../Utils/Structures/BaseCommand');
const { Client, Message } = require('discord.js');

module.exports = class GenerateTokenCommand extends BaseCommand {
	constructor() {
		super('generatetoken', 'owner', []);
	}
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string[]} args
	 */
	async run(client, message, args) {
		const user = message.mentions.members.first();

		function create_UUID() {
			var dt = new Date().getTime();
			var uuid = 'xxxxxxxxxxxxyxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = (dt + Math.random() * 16) % 16 | 0;
				dt = Math.floor(dt / 16);
				return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
			});
			return uuid;
		}
	}
};
