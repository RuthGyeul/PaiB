const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
	name: '',
	aliases: [],
	category: '',
	description: '',
	utilisation: '{prefix}',

	execute(client, message) {
		const msg = message;
		const cmd = msg.content;
		try {
		} catch (e) {
			client.errI(`명령어: ${cmd}\n에러: ${e}`, msg.channel);
			return;
		}
	}
};
