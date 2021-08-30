const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = (client, message) => {
	try {
		if (message.author.bot || message.channel.type === 'dm') return;

		const prefix = client.config.prefix;

		if (message.content.indexOf(prefix) !== 0) return;

		const args = message.content
			.slice(prefix.length)
			.trim()
			.split(/ +/g);
		const command = args.shift().toLowerCase();
		const cmd =
			client.commands.get(command) ||
			client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

		if (cmd) cmd.execute(client, message, args);
	} catch (e) {
		console.log(e);
		message.reply(`\n에러: ${e}`);
		return;
	}
};
