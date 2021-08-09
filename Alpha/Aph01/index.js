const Discord = require('discord.js');
const drply = require('discord-reply');
const GIGacha = require('./gacha.js');
const utils = require('./utility.js');
const keepAlive = require('./server.js');

const bot = new Discord.Client();
const client = new Discord.Client();

const TOKEN = client.config.token;
const PREFIX = client.config.prefix;

var gch = new GIGacha();

/*---- Core ----*/
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of events) {
	console.log(`Loaded event: ${file}`);
	const event = require(`./events/${file}`);
	client.on(file.split('.')[0], event.bind(null, client));
}

/*---- Command ----*/
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

/*---- 기본 명령어 ----*/
client.on('message', async message => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content.slice(PREFIX.length).split(/ +/);

	switch (args[0]) {
		case 'pull':
			gch.multi_pull(message, args[1], args[2]);
			break;

		case 'register':
			gch.player_join(message, message.author);
			break;

		case 'setpity':
			if (!args[1]) return message.channel.send(`Invalid input!`);
			gch.set_pity(message, message.author, args[1], args[2]);
			break;

		case 'summ':
			gch.get_pity(message, message.author);
			break;

		case 'reset':
			gch.reset_pity(message);
			break;

		case 'help':
			utils.get_help(message);
			break;

		case 'resin':
			if (!args[1]) return message.channel.send(`Invalid input!`);
			utils.get_max_resin_time(message, args[1], args[2], args[3]);
			break;

		case 'abyss':
			utils.get_abyss_reset(message);
			break;

		case 'admin':
			if (message.author.id != client.config.author)
				return message.channel.send('Only bot admin allow to use this command');
			if (!args[2])
				return message.channel.send(
					`The command is ${PREFIX}admin <command> <banner> <item>`
				);
			var keyword = message.content.substring(
				PREFIX.length + args[0].length + args[1].length + args[2].length + 3
			);
			utils.change_banner(message, args[1], args[2], keyword);
			break;
	}
});

/*---- 봇 추가 ----*/
client.on('guildCreate', guild => {});

/*---- 봇 삭제 ----*/
client.on('guildDelete', guild => {});

/*---- 서버 ----*/
keepAlive();
client.login(TOKEN);
