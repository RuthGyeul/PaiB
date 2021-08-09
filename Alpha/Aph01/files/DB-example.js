client.on('message', message => {
	const msg = message;
	const cmd = msg.content;
	const fileDB = require('./fileDB/name.json');

	if (msg) {
		if (!fileDB[msg.guild.id]) fileDB[msg.guild.id] = { messageCount: 1 };
		else fileDB[msg.guild.id].messageCount++;
		try {
			fs.writeFileSync('./fileDB/name.json', JSON.stringify(fileDB));
		} catch (err) {
			console.error(err);
		}
	}

	if (cmd === ';chat') {
		const messageCount = fileDB[msg.guild.id].messageCount;

		msg.channel
			.send(`**${messageCount}** 개의 메시지를 전송했습니다.`)
			.catch(console.error);
	}
});
