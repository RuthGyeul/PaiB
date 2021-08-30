const Discord = require('discord.js');
const moment = require('moment');
const prettyMilliseconds = require('pretty-ms');
const client = new Discord.Client();

module.exports = {
	name: 'bot',
	aliases: ['i', 'ping', '핑', 'uptime', '봇', '봇정보'],
	category: 'Info',
	description: 'Show bot status info',
	utilisation: '{prefix}bot',

	execute(client, message) {
		const msg = message;
		const cmd = msg.content;
		try {
			const totalUsers = client.guilds.cache.reduce(
				(users, value) => users + value.memberCount,
				0
			);
			const totalGuilds = client.guilds.cache.size;
			const totalChannels = client.channels.cache.size;
			const info = new Discord.MessageEmbed()
				.setTitle('Server Status Info')
				.setURL('https://stats.uptimerobot.com/Vo4oVIlnOX/788490714')
				.setColor('#FFD700')
				.setDescription(
					`🛰 Ping : ${client.ws.ping}ms\n⏳ Uptime : ${prettyMilliseconds(
						client.uptime
					)} \n\n⚡ Serving Servers: ${totalGuilds} \n⚡ Serving Users: ${totalUsers} \n💕 Connected Channels: ${
						client.voice.connections.size
					}`
				)
				.setThumbnail()
				.setFooter(
					message.author.tag,
					message.author.avatarURL({ dynamic: true, format: 'jpg', size: 2048 })
				)
				.setTimestamp();

			msg.channel.send(info);
		} catch (e) {
			console.log(e);
			message.reply(`\n에러: ${e}`);
			return;
		}
	}
};
