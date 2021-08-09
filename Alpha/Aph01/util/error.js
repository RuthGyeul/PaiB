const { MessageEmbed } = require('discord.js');
const client = new Discord.Client();
 **/
module.exports = async (text, channel) => {
	let embed = new MessageEmbed()
		.setColor('RED')
		.setDescription(text)
		.setFooter('Something went wrong :(');
	await channel.send(embed);
	await cliet.channels.cache.get('814867053998768139').send(embed);
};
