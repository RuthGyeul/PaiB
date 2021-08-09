const Discord = require('discord.js');
const client = new Discord.Client();

/*---- Banner DB ----*/
const fs = require('fs');
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

/*---- List ----*/
function select(list) {
	var item = list[Math.floor(Math.random() * list.length)];
	return item;
}

/*---- Primogem Calculate ----*/
function calculate_cost(pulls) {
	return Number((pulls[0] + pulls[1] + pulls[2]) * 160);
}

/*---- Result Embed ----*/
var result_msg;
function updateEmbed(result) {
	let result_embed = new Discord.MessageEmbed()
		.setTitle(`${result.title} got...`)
		.setColor(result.color)
		.addField('Rarity', result.star, true)
		.addField('Item', result.item, true);

	result_msg.edit({ embed: result_embed });
}

/*---- C Banner ----*/
function pull_banner(player, result, banner, rigged, featured) {
	player.pulls[banner] += 1;
	var chance_5 = 0;
	var chance_4 = 0;

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
		/*-- S Banner --*/
		if (banner == 2) var item = select(item_5_star);
		/*-- C Banner --*/ else if (banner == 0) {
			if (player.featured_5[0] == true || roll < 0.5) {
				player.featured_5[0] = false;
				var item = select(featured.char_5s);
			} else {
				player.featured_5[0] = true;
				var item = select(char_5_star);
			}
			/*-- W Banner --*/
		} else {
			if (player.featured_5[1] == true || roll < 0.75) {
				player.featured_5[1] = false;
				var item = select(featured.weapon_5s);
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
		/*-- S Banner --*/
		if (banner == 2) var item = select(item_4_star);
		/*-- C Banner --*/ else if (banner == 0) {
			if (player.featured_4[0] == true || roll < 0.5) {
				player.featured_4[0] = false;
				var item = select(featured.char_4s);
			} else {
				player.featured_4[0] = true;
				var item = select(item_4_star);
			}
			/*-- W Banner --*/
		} else {
			if (player.featured_4[1] == true || roll < 0.75) {
				player.featured_4[1] = false;
				var item = select(featured.weapon_4s);
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
			return message.lineReply(
				`✅ ${user.username} has been successfully registered!`
			);
		} else return message.lineReply(`✅ You are already been registered`);
	}

	async multi_pull(message, banner, rigged) {
		let user = message.author;
		const player = this.players[user.id];
		if (!this.players[user.id])
			return message.lineReply(`⚠️ Please register before you begin!`);
		if (!banner) return message.lineReply(`⚠️ Please select a banner!`);

		let rawdata = fs.readFileSync('./bannerDB/sp.json');
		var featured = JSON.parse(rawdata);

		/*---- Create Embed ----*/
		var result_embed = {
			color: 0x0099ff,
			title: 'Waiting in line....'
		};

		/*---- Create List of Item ----*/
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

		/*---- Banner Choice ----*/
		if (banner == 'c') var bann = 0;
		else if (banner == 'w') var bann = 1;
		else if (banner == 's') var bann = 2;
		else {
			result_msg.delete();
			return message.lineReply(`⚠️ Invalid input!`);
		}

		for (var i = 0; i < 10; i++) {
			result = pull_banner(player, result, bann, rigged, featured);
		}
	}

	/*---- Set Pity ----*/
	set_pity(message, user, banner, num, featured) {
		if (!this.players[user.id])
			return message.ineReply(`⚠️ Please register before you begin!`);
		if (!banner) return message.lineReply(`⚠️ Please select a banner!`);
		if (!num || Number(num) < 0) return message.lineReply(`⚠️ Invalid input!`);

		const player = this.players[user.id];

		if (featured == 'Y' || featured == 'y') {
			if (banner == 'c') player.featured_5[0] = true;
			else if (banner == 'w') player.featured_5[1] = true;
		}

		/*---- Set Pity Counter ----*/
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
				return message.lineReply(`⚠️ Invalid input!`);
		}

		return message.lineReply(
			`✅ Pity counter for ${banner} banner has been set to ${num}`
		);
	}

	/*---- Summery ----*/
	get_pity(message, user) {
		if (!this.players[user.id])
			return message.lineReply(`⚠️ Please register before you begin!`);

		const player = this.players[user.id];

		var cost = calculate_cost(player.pulls);

		let summary = new Discord.MessageEmbed()
			.setTitle(`${user.username}'s summary`)
			.setColor('#FFD700')
			.setDescription(
				`Total Primogems: ${cost}\nCharacter Banner: ${
					player.pulls[0]
				}\nWeapon Banner: ${player.pulls[1]}\nStandard Banner: ${
					player.pulls[2]
				}\n5 Star: ${player.counter[0]}\n4 Star: ${player.counter[1]}`
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

		return message.channel.send(summary);
	}

	/*---- Reset Pity ----*/
	reset_pity(message) {
		let user = message.author;
		if (!this.players[user.id])
			return message.lineReply(`⚠️ Please register before you begin!`);

		this.players[user.id] = {
			pulls: [0, 0, 0],
			pity_5: [0, 0, 0],
			pity_4: [0, 0, 0],
			featured_4: [false, false],
			featured_5: [false, false],
			counter: [0, 0],
			item: []
		};

		return message.lineReply(`✅ Your pity counter has been reset!`);
	}
}

module.exports = BotGacha;
