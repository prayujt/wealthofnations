const { dropCollection } = require('../global');

exports.initializeDatabase = async (client) => {
	try {
		await dropCollection('lobbies', client);
	} catch (err) {
		console.log('Lobbies collection not found');
	}
	try {
		await dropCollection('lobbyPlayers', client);
	} catch (err) {
		console.log('Lobby players collection not found');
	}
	try {
		await dropCollection('lobbyMessages', client);
	} catch (err) {
		console.log('Lobby messages collection not found');
	}
	try {
		await dropCollection('uniqueKeys', client);
	} catch (err) {
		console.log('Unique IDs collection not found');
	}
};
