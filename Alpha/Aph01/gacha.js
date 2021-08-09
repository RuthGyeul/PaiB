const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const PREFIX = client.config.prefix;
           
let rawdata = fs.readFileSync('./bannerDB/3s_item.json');
const item_3_star = JSON.parse(rawdata);
rawdata = fs.readFileSync('./bannerDB/4s_item.json');
const item_4_star = JSON.parse(rawdata);
rawdata = fs.readFileSync('./bannerDB/5s_item.json');
const item_5_star = JSON.parse(rawdata);
rawdata = fs.readFileSync('./bannerDB/5s_char.json');
const char_5_star = JSON.parse(rawdata);
rawdata = fs.readFileSync('./bannerDB/5s_weapon.json');
const weapon_5_star = JSON.parse(rawdata);

/*---- Rate ----*/
const RATE = {
	standard_5: [0.006, 0.015, 0.3],
	standard_4: [0.051, 0.34],
	weapon_5: [0.007, 0.0175, 0.35],
	weapon_4: [0.06, 0.4],
	rigged: 0.5
};

/*---- Random ----*/
function select(list) {
	var item = list[Math.floor(Math.random() * list.length)];
	return item;
}

/*---- Primo Count----*/
function calculate_cost(pulls) {
	return Number((pulls[0] + pulls[1] + pulls[2]) * 160).toFixed(2);
}

/*---- Result ----*/
var result_msg;
function updateEmbed(result) {
	let result_embed = new Discord.MessageEmbed()
		.setTitle(`${result.title} got...`)
		.setColor(result.color)
		.addField('Rarity', result.star, true)
		.addField('Item', result.item, true);

	result_msg.edit({ embed: result_embed });
}

/*---- CB ----*/
function pull_banner(player, result, banner, rigged, featured) {
	player.pulls[banner] += 1;
	var chance_5 = 0;
	var chance_4 = 0;

	/*==== NOT EDITED FROM UNDER ====*/

	// check pity
	// 0 - character, 1 - weapon, 2 - standard
	switch (banner) {
		case 0:
		case 2:
			if (rigged == true) chance_5 = RATE.rigged;
			else if (player.pity_5[banner] < 44) chance_5 = RATE.standard_5[0];
			else if (player.pity_5[banner] < 74) chance_5 = RATE.standard_5[1];
			else if (player.pity_5[banner] < 89) chance_5 = RATE.standard_5[2];
			else chance_5 = 1;

			if (player.pity_4[banner] < 6) chance_4 = RATE.standard_4[0];
			else if (player.pity_4[banner] < 9) chance_4 = RATE.standard_4[1];
			else chance_4 = 1;
			break;

		case 1:
			if (rigged == true) chance_5 = RATE.rigged;
			else if (player.pity_5[banner] < 34) chance_5 = RATE.weapon_5[0];
			else if (player.pity_5[banner] < 64) chance_5 = RATE.weapon_5[1];
			else if (player.pity_5[banner] < 79) chance_5 = RATE.weapon_5[2];
			else chance_5 = 1;

			if (player.pity_4[banner] < 6) chance_4 = RATE.weapon_4[0];
			else if (player.pity_4[banner] < 9) chance_4 = RATE.weapon_4[1];
			else chance_4 = 1;
			break;
	}

	/*-- Dice --*/
	var roll = Math.random();

	/*-- 5s --*/
	if (roll < chance_5) {
		player.pity_5[banner] = 0;
		player.pity_4[banner] += 1;
		player.counter[0] += 1;
		result.color = 'FFD700';
		var star = `★★★★★`;
		let roll = Math.random();
		/*-- IF SB --*/
		if (banner == 2) var item = select(item_5_star);
		/*-- IF CB --*/ else if (banner == 0) {
			if (player.featured_5[0] == true || roll < 0.5) {
				player.featured_5[0] = false;
				var item = select(featured.char_5star);
			} else {
				player.featured_5[0] = true;
				var item = select(char_5_star);
			}
			/*-- IF WB --*/
		} else {
			if (player.featured_5[1] == true || roll < 0.75) {
				player.featured_5[1] = false;
				var item = select(featured.weapon_5star);
			} else {
				player.featured_5[1] = true;
				var item = select(weapon_5_star);
			}
		}
	} else if (roll < chance_5 + chance_4) {
		/*-- 4s --*/
		player.pity_5[banner] += 1;
		player.pity_4[banner] = 0;
		player.counter[1] += 1;
		var star = `★★★★`;
		let roll = Math.random();
		/*-- IF SB --*/
		if (banner == 2) var item = select(item_4_star);
		/*-- IF CB --*/ else if (banner == 0) {
			if (player.featured_4[0] == true || roll < 0.5) {
				player.featured_4[0] = false;
				var item = select(featured.char_4star);
			} else {
				player.featured_4[0] = true;
				var item = select(item_4_star);
			}
			/*-- IF WB --*/
		} else {
			if (player.featured_4[1] == true || roll < 0.75) {
				player.featured_4[1] = false;
				var item = select(featured.weapon_4star);
			} else {
				player.featured_4[1] = true;
				var item = select(item_4_star);
			}
		}
	} else {
		/*-- 3s --*/
		player.pity_5[banner] += 1;
		player.pity_4[banner] += 1;
		var star = `★★★`;
		var item = select(item_3_star);
	}

	result.star += `\n ${star}`;
	result.item += `\n ${item}`;
	if (player.pulls[banner] % 2 == 0) updateEmbed(result);
	return result;
}

class BotGacha {
	constructor() {
		this.players = {};
	}

	player_join(message, user) {
		// [0] is 4 star, [1] is 5 star
		if (!this.players[user.id]) {
			this.players[user.id] = {
				pulls: [0, 0, 0],
				pity_5: [0, 0, 0],
				pity_4: [0, 0, 0],
				featured_4: [false, false],
				featured_5: [false, false],
				counter: [0, 0],
				item: []
			};
			return message.channel.send(user.username + ` has joined the salt!`);
		} else return message.channel.send(`You already joined the salt!`);
	}

	async multi_pull(message, banner, rigged) {
		let user = message.author;
		const player = this.players[user.id];
		if (!this.players[user.id])
			return message.channel.send(`Please use !register to join the salt!`);
		if (!banner) return message.channel.send(`Please select a banner`);

		let rawdata = fs.readFileSync('./bannerDB/sp.json');
		var featured = JSON.parse(rawdata);

		// create an embed
		var result_embed = {
			color: 0x0099ff,
			title: 'Waiting in line....'
		};

		// create a list of item got
		var result = {
			title: user.username,
			color: 'BA55D3',
			star: ``,
			item: ``
		};

		await message.channel.send({ embed: result_embed }).then(message => {
			result_msg = message;
		});

		if (rigged == 'rigged') rigged = true;
		else rigged = false;

		if (banner == 'c') var bann = 0;
		else if (banner == 'w') var bann = 1;
		else if (banner == 's') var bann = 2;
		else {
			// user input other than c/w/s
			result_msg.delete();
			return message.channel.send(`Invalid input!`);
		}

		for (var i = 0; i < 10; i++) {
			result = pull_banner(player, result, bann, rigged, featured);
		}
	}

	// set pity at the specific banner
	set_pity(message, user, banner, num, featured) {
		if (!this.players[user.id])
			return message.channel.send(`Please use !register to join the salt!`);
		if (!banner) return message.channel.send(`Please select a banner`);
		if (!num || Number(num) < 0) return message.channel.send(`Invalid input`);

		const player = this.players[user.id];

		if (featured == 'y') {
			if (banner == 'c') player.featured_5[0] = true;
			else if (banner == 'w') player.featured_5[1] = true;
		}

		// manually set the pity counter at the selected banner
		switch (banner) {
			case 'c':
				banner = 0;
				while (num >= 90) num -= 90;
				player.pity_5[banner] = Number(num);
				player.pity_4[banner] = Number(num) % 10;
				banner = 'character';
				break;

			case 'w':
				banner = 1;
				while (num >= 80) num -= 80;
				player.pity_5[banner] = Number(num);
				player.pity_4[banner] = Number(num) % 10;
				banner = 'weapon';
				break;

			case 's':
				banner = 2;
				while (num >= 90) num -= 90;
				player.pity_5[banner] = Number(num);
				player.pity_4[banner] = Number(num) % 10;
				banner = 'standard';
				break;

			default:
				return message.channel.send(`Invalid input`);
		}

		return message.channel.send(
			`Pity counter for ${banner} banner has been set to ${num}`
		);
	}

	/*---- Summary ----*/
	get_pity(message, user) {
		if (!this.players[user.id])
			return message.channel.send(
				`Please use ${PREFIX}register to be ready for your pull!`
			);

		const player = this.players[user.id];

		var cost = calculate_cost(player.pulls);

		let summary = new Discord.MessageEmbed().setTitle(
			`${user.username}'s summary`
		).setDescription(`Total pulls
        Character banner: ${player.pulls[0]}\n\nWeapon banner: ${
			player.pulls[1]
		}\nStandard banner: ${player.pulls[2]}\n4 star: ${
			player.counter[1]
		}\n5 star: ${player.counter[0]}\n\nCost: Primo${cost}`);

		return message.channel.send(summary);
	}

	/*---- Reset Pity ----*/
	reset_pity(message) {
		let user = message.author;
		if (!this.players[user.id])
			return message.channel.send(
				`Please use ${PREFIX}register to be ready for your pull!`
			);

		this.players[user.id] = {
			pulls: [0, 0, 0],
			pity_5: [0, 0, 0],
			pity_4: [0, 0, 0],
			featured_4: [false, false],
			featured_5: [false, false],
			counter: [0, 0],
			item: []
		};

		return message.channel.send(`Your pity counter has been reset!`);
	}
}

module.exports = GIGacha;
