const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
	name: 'help',
	aliases: ['h', '명령어', '도움말'],
	category: 'Info',
	description: 'Show command list or detail of command',
	utilisation: '{prefix}help <command>',

	execute(client, message, args) {
		const msg = message;
		const cmd = msg.content;
		try {
			if (!args[0]) {
				const bannerG = message.client.commands
					.filter(x => x.category == 'BannerG')
					.map(x => '`' + x.name + '`')
					.join(', ');
				const info = message.client.commands
					.filter(x => x.category == 'Info')
					.map(x => '`' + x.name + '`')
					.join(', ');

				const helpC = new Discord.MessageEmbed()
					.setTitle(`All Commands v3.0`)
					.setColor('#FFD700')
					.setDescription(
						`To see more detail, type: ${client.config.prefix}h <command name>`
					)
					.addFields(
						{ name: 'Info', value: info },
						{ name: 'Gacha', value: bannerG }
					)
					.setTimestamp()
					.setFooter(
						message.author.tag,
						message.author.avatarURL({
							dynamic: true,
							format: 'jpg',
							size: 2048
						})
					);

				msg.channel.send(helpC);
			} else {
				const command =
					message.client.commands.get(args.join(' ').toLowerCase()) ||
					message.client.commands.find(
						x => x.aliases && x.aliases.includes(args.join(' ').toLowerCase())
					);

				if (!command) return msg.reply(`\n⚠️ | This command doesn't exist!`);

				const helpCD = new Discord.MessageEmbed()
					.setTitle(`Command Detail`)
					.setColor('#FFD700')
					.setDescription(command.description)
					.addFields(
						{ name: 'Name', value: command.name, inline: true },
						{
							name: 'Aliase(s)',
							value:
								command.aliases.length < 1
									? 'None'
									: command.aliases.join(', '),
							inline: true
						},
						{ name: 'Category', value: command.category, inline: true },

						{
							name: 'Utilisation',
							value: command.utilisation.replace(
								'{prefix}',
								client.config.prefix
							),
							inline: true
						}
					)
					.setTimestamp()
					.setFooter(
						message.author.tag,
						message.author.avatarURL({
							dynamic: true,
							format: 'jpg',
							size: 2048
						})
					);

				msg.channel.send(helpCD);
			}
		} catch (e) {
			console.log(e);
			message.reply(`\n에러: ${e}`);
			return;
		}
	}
};
