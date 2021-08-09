const Discord = require('discord.js');
const moment = require('moment');
const chalk = require('chalk');

module.exports = async client => {
	let totalUsers = client.guilds.cache.reduce(
		(users, value) => users + value.memberCount,
		0
	);
	let totalGuilds = client.guilds.cache.size;
	let totalChannels = client.channels.cache.size;
	let Binfo = new Discord.MessageEmbed()
		.setTitle(`${client.user.username} 가동 시작`)
		.setURL('https://paib.rutheon.repl.co')
		.setDescription(
			`Bot is now activated.\n${moment().format('YYYY-MM-DD HH:mm:ss')}`
		)
		.setColor(client.color.bot)
		.setTimestamp()
		.setFooter('Powered by Rutheon#6205');

	client.channels.cache.get('807343224199970887').send(Binfo);
	console.log(
		chalk.green`[${moment().format(
			'YYYY-MM-DD HH:mm:ss'
		)}] SYS: Token file verified.`
	);
	console.log(
		chalk.green`[${moment().format(
			'YYYY-MM-DD HH:mm:ss'
		)}] SYS: All code has been reloaded.`
	);
	console.log(
		chalk.green`[${moment().format(
			'YYYY-MM-DD HH:mm:ss'
		)}] SYS: Bot active message pushed.`
	);
	console.log(
		chalk.red`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: ${
			client.user.id
		} - Now Activated!`
	);
	console.log(
		chalk.red`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: ${
			client.user.username
		} - Logged In!`
	);
	console.log(
		chalk.blue`[${moment().format('YYYY-MM-DD HH:mm:ss')}]` +
			` Now serving ` +
			totalGuilds +
			` Servers, ` +
			totalChannels +
			` Channels and ` +
			totalUsers +
			` Users!`
	);

	var activities = client.config.activities,
		i = 0;
	setInterval(
		() =>
			client.user.setActivity(`${activities[i++ % activities.length]}`, {
				type: 'PLAYING'
			}),
		3000
	);
};
