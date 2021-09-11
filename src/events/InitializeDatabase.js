const { createCollection, dropCollection } = require('../global');

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
	await createCollection('lobbies', client);
	await createCollection('lobbyPlayers', client);
	await createCollection('lobbyMessages', client);
};
