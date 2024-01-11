module.exports = async (client) => {
    const status = [
		'・ Rede Notz.',
	];
	i = 0;
	client.user.setActivity(status[0]);
	client.user.setStatus('online');
	console.log('😍 ' + client.user.username + ' started working!');
};