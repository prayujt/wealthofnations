const {
	createTable,
	dropTable,
	get,
	getAll,
	insert,
	exists,
	distinct,
	update,
	replace,
	watch,
	match,
	remove,
	removeAll,
} = require('../../global');

exports.serverLobbyFunctions = async (client, io, gameID) => {
	watch(
		'players',
		async (value) => {
			let players = await getAll('players', {}, client);
			io.to(gameID).emit('lobbyPlayerChange', players);
		},
		client
	);

	watch(
		'messages',
		async (value) => {
			if (value.operationType != 'delete') {
				// let gameID = value.fullDocument.gameID;
				let messages = await getAll('messages', {}, client);
				io.to(gameID).emit('lobbyMessageReceived', messages);
			}
		},
		client
	);
};
