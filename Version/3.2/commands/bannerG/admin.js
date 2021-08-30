const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

/*---- Fetch Item ----*/
function get_array_from_item(item) {
	var item_list = item.split(',');
	return item_list;
}

/*---- Change Banner ----*/
function change_banner(message, command, banner, item) {
	//show, add
	var featured_database = './bannerDB/sp.json';
	let rawdata = fs.readFileSync('./bannerDB/sp.json');
	const featured = JSON.parse(rawdata);

	if (command == 'add') {
		if (!item) return message.reply('Incorrect input!');
		var item_list = get_array_from_item(item);
		switch (banner) {
			case '4char':
				featured.char_4s = item_list;
				break;

			case '5char':
				featured.char_5s = item_list;
				break;

			case '4weap':
				featured.weapon_4s = item_list;
				break;

			case '5weap':
				featured.weapon_5s = item_list;
				break;

			default:
				return message.reply('Incorrect input!');
		}
	} else if (command == 'show') {
		switch (banner) {
			case '4char':
				return message.channel.send('```' + featured.char_4s + '```');

			case '5char':
				return message.channel.send('```' + featured.char_5s + '```');

			case '4weap':
				return message.channel.send('```' + featured.weapon_4s + '```');

			case '5weap':
				return message.channel.send('```' + featured.weapon_5s + '```');

			default:
				return message.reply('Incorrect input!');
		}
	}

	// save the database
	let data = JSON.stringify(featured, null, 2);
	fs.writeFileSync(featured_database, data);

	message.reply('Banner has been updated!');
}

module.exports = {
	name: 'Admin',
	aliases: ['ad'],
	category: 'BannerG',
	description: 'Edit Banners',
	utilisation: '{prefix}Admin [Command] [Type] [Item, Item]',

	execute(client, message, args) {
		const msg = message;
		const cmd = msg.content;
		const prefix = client.config.prefix;
		try {
			if (msg.author.id != client.config.author)
				return msg.reply('Only Admin can run this command');
			if (!args[1])
				return msg.reply(
					`Wrong Input!\n${prefix}Admin [Command] [Type] [Item, Item]`
				);
			if (args[2]) {
				var keyword = cmd.substring(
					prefix.length + args[0].length + args[1].length + args[2].length + 3
				);
			}
			change_banner(msg, args[0], args[1], keyword);
		} catch (e) {
			console.log(e);
			message.reply(`\n에러: ${e}`);
			return;
		}
	}
};
