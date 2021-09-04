const { connect, dropTable, createTable } = require('../global');

exports.initializeDatabase = async (connection) => {
	try {
		await dropTable('lobbies', connection);
		await dropTable('lobbyPlayers', connection);
		await dropTable('lobbyMessages', connection);
	} catch (err) {
		console.log('Table not found');
	}
	await createTable('lobbies', 'gameID', connection);
	await createTable('lobbyPlayers', 'uuid', connection);
	await createTable('lobbyMessages', 'gameID', connection);
};
