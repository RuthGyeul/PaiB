const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const playerGI = {};

/*---- Banner DB ----*/
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

/*---- GithubFiles ----*/
let single3 =
	'https://raw.githubusercontent.com/Rutheon/PaiB/main/File/wishgif/IMG_0017.gif';
let single4 =
	'https://raw.githubusercontent.com/Rutheon/PaiB/main/File/wishgif/47806356-4E25-4C41-9FA6-059383CC56F8.gif';
let multi4 =
	'https://raw.githubusercontent.com/Rutheon/PaiB/main/File/wishgif/IMG_0018.gif';
let single5 =
	'https://raw.githubusercontent.com/Rutheon/PaiB/main/File/wishgif/IMG_0021.gif';
let multi5 =
	'https://raw.githubusercontent.com/Rutheon/PaiB/main/File/wishgif/IMG_0020.gif';
let spb = 'https://raw.githubusercontent.com/Rutheon/PaiB/main/File/Img/SPbanner/D00BC6EA-C756-48E9-A7BE-F30EB13A534D.png';

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

/*---- Player Register ----*/
function player_join(message, user) {
	// [0] - 4 star
	// [1] - 5 star
	playerGI[user.id] = {
		pulls: [0, 0, 0],
		pity_5: [0, 0, 0],
		pity_4: [0, 0, 0],
		featured_4: [false, false],
		featured_5: [false, false],
		counter: [0, 0],
		item: []
	};
	return console.log(`${user.username} - successfuly registered!`);
}

/*---- Banner Pull ----*/
function pull_banner(player, result, banner, type, rigged, featured) {
	player.pulls[banner] += 1;
	var chance_5 = 0;
	var chance_4 = 0;

	/*-- Check Pity --*/
	// 0 - CB
	// 1 - WB
	// 2 - SB
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

	/*---- Dice Roll ----*/
	var roll = Math.random();

	/*---- 5 Star ----*/
	if (roll < chance_5) {
		player.pity_5[banner] = 0;
		player.pity_4[banner] += 1;
		player.counter[0] += 1;
		result.color = 'FFD700';
		var star = `★★★★★`;
		let roll = Math.random();
		/*-- SB --*/
		if (banner == 2) var item = select(item_5_star);
		/*-- CB --*/ else if (banner == 0) {
			if (player.featured_5[0] == true || roll < 0.5) {
				player.featured_5[0] = false;
				var item = select(featured.char_5s);
			} else {
				player.featured_5[0] = true;
				var item = select(char_5_star);
			}
			/*-- WB --*/
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
		/*---- 4 Star ----*/
		player.pity_5[banner] += 1;
		player.pity_4[banner] = 0;
		player.counter[1] += 1;
		var star = `★★★★`;
		let roll = Math.random();
		/*-- SB --*/
		if (banner == 2) var item = select(item_4_star);
		/*-- CB --*/ else if (banner == 0) {
			if (player.featured_4[0] == true || roll < 0.5) {
				player.featured_4[0] = false;
				var item = select(featured.char_4s);
			} else {
				player.featured_4[0] = true;
				var item = select(item_4_star);
			}
			/*-- WB --*/
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
		/*---- 3 Star ----*/
		player.pity_5[banner] += 1;
		player.pity_4[banner] += 1;
		var star = `★★★`;
		var item = select(item_3_star);
	}

	if (type == 0) {
		result.star += `${star}`;
		result.item += `${item}`;
		player.item.push(`${item}`);
		return result;
	} else if (type == 1) {
		result.star += `\n ${star}`;
		result.item += `\n ${item}`;
		player.item.push(`${item}`);
		return result;
	}
}

/*---- Pull CMD ----*/
function multi_pull(message, banner, type, rigged) {
	let user = message.author;
	const player = playerGI[user.id];
	let rawdata = fs.readFileSync('./bannerDB/sp.json');
	var featured = JSON.parse(rawdata);

	/*-- Create List of Result --*/
	var result = {
		title: user.username,
		type: 'BA55D3',
		star: ``,
		item: ``
	};

	/*-- 천장 여부 --*/
	if (rigged == 'rigged') {
		rigged = true;
	} else {
		rigged = false;
	}

	if (type == 0) {
		//1pull
		return pull_banner(player, result, banner, type, rigged, featured);
	} else if (type == 1) {
		//10pull
		for (var i = 0; i < 10; i++) {
			result = pull_banner(player, result, banner, type, rigged, featured);
		}
		return result;
	}
}

/*---- Set Pity ----*/
function set_pity(message, user, banner, num, featured) {
	if (!num || Number(num) < 0)
		return console.log(`${user.username} - wrong input!`);

	const player = playerGI[user.id];

	if (featured == 'Y' || featured == 'y') {
		player.featured_5[1] = true;
	}

	/*-- Set Pity Counter --*/
	switch (banner) {
		case 'C':
			banner = 0;
			while (num >= 90) num -= 90;
			player.pulls[banner] = Number(num);
			player.pity_5[banner] = Number(num);
			player.pity_4[banner] = Number(num) % 10;
			banner = 'character';
			break;

		case 'W':
			banner = 1;
			while (num >= 80) num -= 80;
			player.pulls[banner] = Number(num);
			player.pity_5[banner] = Number(num);
			player.pity_4[banner] = Number(num) % 10;
			banner = 'weapon';
			break;

		case 'S':
			banner = 2;
			while (num >= 90) num -= 90;
			player.pulls[banner] = Number(num);
			player.pity_5[banner] = Number(num);
			player.pity_4[banner] = Number(num) % 10;
			banner = 'standard';
			break;

		default:
			return console.log(`Invalid input!`);
	}

	return console.log(
		`${user.username} - set pity ${Number(num)} / ${player.featured_5[1]}!`
	);
}

/*---- Primogem Calculate ----*/
function calculate_cost(pulls) {
	return Number((pulls[0] + pulls[1] + pulls[2]) * 160);
}

/*---- Summery ----*/
function get_pity(message, user) {
	const player = playerGI[user.id];

	var cost = calculate_cost(player.pulls);

	let smmr = `Total Primogems: ${cost}\nTotal Pulls: ${
		player.pulls[1]
	}\n5 Star: ${player.counter[0]}\n4 Star: ${
		player.counter[1]
	}\n3 Star: ${player.pulls[0] - (player.counter[0] + player.counter[1])}`;

	return smmr;
}

module.exports = {
	name: 'WBanner',
	aliases: ['wb', 'w'],
	category: 'BannerG',
	description: 'Weapon Banner',
	utilisation: '{prefix}wb [Number] [Y]',

	async execute(client, message, args) {
		const msg = message;
		const cmd = msg.content;
		try {
			/*-- Default Screen Embed --*/
			let scE = new Discord.MessageEmbed()
				//.setTimestamp()
				.setFooter(
					message.author.tag + ' | Weapon Banner',
					message.author.avatarURL({ dynamic: true, format: 'jpg', size: 2048 })
				);

			/*-- admin --*/
			if (msg.author.id == client.config.author && cmd == '_wb admin') {
				return console.log(playerGI[msg.author.id]);
			}

			/*-- Register --*/
			player_join(msg, msg.author);

			/*-- Set Pity --*/
			if (args[0]) {
				set_pity(msg, msg.author, 'W', args[0], args[1]);
			}

			/*-- Main Screen --*/
			scE.setTitle(`Weapon Banner: 예초의 번개`);
			scE.setColor('GREEN');
			scE.setImage(spb);
			scE.setDescription(
				'1️⃣ - 1 연차\n🔟 - 10 연차\n✳️ - 가챠 목록 보기\n✅ - 종료 및 결과 확인'
			);
			const msgEmbed = await message.channel.send(scE);
			msgEmbed.react('1️⃣');
			msgEmbed.react('🔟');
			msgEmbed.react('✳️');
			msgEmbed.react('✅');

			const filter = (reaction, user) =>
				['1️⃣', '🔟', '✳️', '✅', '⬅️', '➡️'].includes(reaction.emoji.name) &&
				message.author.id === user.id;
			const collector = msgEmbed.createReactionCollector(filter, {
				time: 600000
			});

			collector.on('collect', async (reaction, user) => {
				try {
					if (reaction.emoji.name === '1️⃣') {
						reaction.message.reactions.removeAll();
						let p1 = multi_pull(msg, 1, 0);
						let pst1 = playerGI[user.id];
						if (pst1.featured_5[1] == true) {
							var ft1 = '확정';
						} else if (pst1.featured_5[1] == false) {
							var ft1 = '픽뚫';
						}
						if (pst1.featured_4[1] == true) {
							var ft41 = '확정';
						} else if (pst1.featured_4[1] == false) {
							var ft41 = '픽뚫';
						}
						scE.setTitle(
							`1️⃣ 연차 결과 {총: ${pst1.pulls[1]}스택}\n[ 4성 ${ft41} \u279C ${
								pst1.pity_4[1]
							}스택 | 5성 ${ft1} \u279C ${pst1.pity_5[1]}스택 ]`
						);
						if (p1.star.includes('★★★★★')) {
							scE.setImage(single5);
						} else if (p1.star.includes('★★★★')) {
							scE.setImage(single4);
						} else {
							scE.setImage(single3);
						}
						scE.setColor('BLUE');
						scE.setDescription('');
						msgEmbed.edit(scE).then(msgEmbed => {
							setTimeout(function() {
								if (p1.star.includes('★★★★★')) {
									scE.setColor('GOLD');
								} else if (p1.star.includes('★★★★')) {
									scE.setColor('PURPLE');
								} else {
									scE.setColor('BLUE');
								}
								scE.setImage();
								scE.setDescription('```' + p1.item + '```');
								msgEmbed.edit(scE);
								msgEmbed.react('1️⃣');
								msgEmbed.react('🔟');
								msgEmbed.react('✳️');
								msgEmbed.react('✅');
							}, 6150);
						});
					} else if (reaction.emoji.name === '🔟') {
						reaction.message.reactions.removeAll();
						let p2 = multi_pull(msg, 1, 1);
						let pst2 = playerGI[user.id];
						if (pst2.featured_5[1] == true) {
							var ft2 = '확정';
						} else if (pst2.featured_5[1] == false) {
							var ft2 = '픽뚫';
						}
						if (pst2.featured_4[1] == true) {
							var ft42 = '확정';
						} else if (pst2.featured_4[1] == false) {
							var ft42 = '픽뚫';
						}
						scE.setTitle(
							`🔟 연차 결과 {총: ${pst2.pulls[1]}스택}\n[ 4성 ${ft42} \u279C ${
								pst2.pity_4[1]
							}스택 | 5성 ${ft2} \u279C ${pst2.pity_5[1]}스택 ]`
						);
						if (p2.star.includes('★★★★★')) {
							scE.setImage(multi5);
						} else {
							scE.setImage(multi4);
						}
						scE.setColor('BLUE');
						scE.setDescription('');
						msgEmbed.edit(scE).then(msgEmbed => {
							setTimeout(function() {
								if (p2.star.includes('★★★★★')) {
									scE.setColor('GOLD');
								} else {
									scE.setColor('PURPLE');
								}
								scE.setImage();
								scE.setDescription('```' + p2.item + '```');
								msgEmbed.edit(scE);
								msgEmbed.react('1️⃣');
								msgEmbed.react('🔟');
								msgEmbed.react('✳️');
								msgEmbed.react('✅');
							}, 6150);
						});
					} else if (reaction.emoji.name === '✳️') {
						reaction.message.reactions.removeAll();
						scE.setImage();
						scE.setTitle(`가챠 목록 [0/2]`);
						scE.setColor('GREEN');
						scE.setDescription(
							'```기능 준비 중\n지금껏 뽑은 모든 캐릭/아이템 목록을 보여줍니다.\n⬅️ - 왼쪽으로 페이지 넘기기\n➡️ - 오른쪽으로 페이지 넘기기```'
						);
						msgEmbed.edit(scE);
						msgEmbed.react('1️⃣');
						msgEmbed.react('🔟');
						msgEmbed.react('✅');
						msgEmbed.react('⬅️');
						msgEmbed.react('➡️');
					} else if (reaction.emoji.name === '✅') {
						collector.stop();
						reaction.message.reactions.removeAll();
						scE.setImage();
						scE.setTitle(`가챠 기록 요약`);
						scE.setColor('GREEN');
						scE.setDescription('```' + `${get_pity(msg, msg.author)}` + '```');
						msgEmbed.edit(scE);
					} else if (reaction.emoji.name === '⬅️') {
						scE.setImage();
						scE.setTitle(`가챠 목록 [1/2]`);
						scE.setColor('GREEN');
						scE.setDescription('```기능 준비 중\n페이지 1```');
						msgEmbed.edit(scE);
					} else if (reaction.emoji.name === '➡️') {
						scE.setImage();
						scE.setTitle(`가챠 목록 [2/2]`);
						scE.setColor('GREEN');
						scE.setDescription('```기능 준비 중\n페이지 2```');
						msgEmbed.edit(scE);
					} else {
						collector.stop();
						reaction.message.reactions.removeAll();
					}
					await reaction.users.remove(message.author.id);
				} catch (e) {
					console.log(e);
					message.reply(`\n에러: ${e}`);
					return;
				}
			});
		} catch (e) {
			console.log(e);
			message.reply(`\n에러: ${e}`);
			return;
		}
	}
};
