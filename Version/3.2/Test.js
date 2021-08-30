/*---- Set Pity ----*/
function set_pity(message, user, banner, num, featured) {
	if (!num || Number(num) < 0) return msg.reply(`⚠️ Invalid input!`);

	const player = playerGI[user.id];

	if (featured == 'Y' || featured == 'y') {
		player.featured_5[0] = true;
	}

	/*-- Set Pity Counter --*/
	//banner = 0;
	while (num >= 90) num -= 90;
	player.pity_5[banner] = Number(num);
	player.pity_4[banner] = Number(num) % 10;
	//banner = 'character';

	return console.log(`CB Pity counter for ${player} has been set to ${num}`);
}
