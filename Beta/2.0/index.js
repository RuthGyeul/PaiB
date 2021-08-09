/*---- 객체 ----*/
const Discord = require('discord.js');
const discord = require('discord.js');
const fs = require('fs');
const drply = require('discord-reply');
const keepAlive = require('./server.js');

var BotGacha = require('./gacha.js');
var utils = require('./utility.js');
const client = new discord.Client();

client.colors = require('./configs/color.js');
client.config = require('./configs/config.js');
client.emote = require('./configs/emoji.js');

var botgacha = new BotGacha();

/*---- 이벤트 파일 읽기 ----*/
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of events) {
	console.log(`Loaded event: ${file}`);
	const event = require(`./events/${file}`);
	client.on(file.split('.')[0], event.bind(null, client));
}

/*---- 메인 ----*/
client.on('message', async message => {
	const msg = message;
	const cmd = msg.content;
	const PREFIX = client.config.prefix;

	/*---- Core ----*/
	if (!cmd.startsWith(PREFIX) || msg.author.bot) return;

	const args = cmd.slice(PREFIX.length).split(/ +/);

	switch (args[0]) {
		case 'pull':
			botgacha.multi_pull(msg, args[1], args[2]);
			break;

		case 'register':
			botgacha.player_join(msg, msg.author);
			break;

		case 'setpity':
			if (!args[1]) return msg.channel.send(`Invalid input!`);
			botgacha.set_pity(msg, msg.author, args[1], args[2]);
			break;

		case 'summ':
			botgacha.get_pity(msg, msg.author);
			break;

		case 'reset':
			botgacha.reset_pity(msg);
			break;

		case 'help':
			utils.get_help(msg);
			break;

		case 'resin':
			if (!args[1]) return msg.channel.send(`Invalid input!`);
			utils.get_max_resin_time(msg, args[1], args[2], args[3]);
			break;

		case 'abyss':
			utils.get_abyss_reset(msg);
			break;

		case 'admin':
			if (msg.author.id != client.config.admin)
				return msg.channel.send('Only Admin can use this command');
			if (!args[2])
				return msg.channel.send(
					`The command is !admin <command> <banner> <item>`
				);
			var keyword = cmd.substring(
				PREFIX.length + args[0].length + args[1].length + args[2].length + 3
			);
			utils.change_banner(msg, args[1], args[2], keyword);
			break;
	}
});

/*---- 서버 ----*/
keepAlive();
client.login(client.config.token);
