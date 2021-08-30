require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const keepAlive = require('./server.js');
const client = new Discord.Client();

/*---- Config ----*/
client.config = require('./configs/config.js');
client.commands = new Discord.Collection();
const TOKEN = client.config.token;

/*---- Event ----*/
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of events) {
	console.log(`Loaded event: ${file}`);
	const event = require(`./events/${file}`);
	client.on(file.split('.')[0], event.bind(null, client));
}

/*---- Commands ----*/
fs.readdirSync('./commands').forEach(dirs => {
	const commands = fs
		.readdirSync(`./commands/${dirs}`)
		.filter(files => files.endsWith('.js'));

	for (const file of commands) {
		const command = require(`./commands/${dirs}/${file}`);
		console.log(`Loaded command: ${file}`);
		client.commands.set(command.name.toLowerCase(), command);
	}
});

client.on('message', message => {
	const msg = message;
	const cmd = msg.content;
	if (cmd == '_pull') {
		msg.reply(
			'\n많은 분들이 페이봇을 이용해 주셔서,\n봇 내부 서버 최적화 목적으로 명령어를 변경하였습니다.\n아래의 명령어로 사용 바랍니다.\n_cb'
		);
	}
});

/*---- Server ----*/
keepAlive();
client.login(TOKEN);
