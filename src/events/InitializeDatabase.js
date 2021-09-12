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
	try {
		await dropCollection('games', client);
	} catch (err) {
		console.log('Games collection not found');
	}
	try {
		await dropCollection('players', client);
	} catch (err) {
		console.log('Players collection not found');
	}
	try {
		await dropCollection('cities', client);
	} catch (err) {
		console.log('Cities collection not found');
	}
	try {
		await dropCollection('companies', client);
	} catch (err) {
		console.log('Companies collection not found');
	}
	await createCollection('lobbies', client);
	await createCollection('lobbyPlayers', client);
	await createCollection('lobbyMessages', client);
	await createCollection('games', client);
	await createCollection('players', client);
	await createCollection('cities', client);
	await createCollection('companies', client);
};
