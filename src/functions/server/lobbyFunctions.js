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

exports.serverLobbyFunctions = async (client, io) => {
	watch(
		'lobbyPlayers',
		async (value) => {
			if (value.operationType == 'delete' || value.operationType == 'update') {
				let gameIDs = await distinct('lobbyPlayers', 'gameID', client);
				gameIDs.forEach(async (gameID) => {
					let players = await getAll(
						'lobbyPlayers',
						{ gameID: gameID },
						client
					);
					io.to(gameID).emit('lobbyPlayerChange', players);
				});
			} else {
				let gameID = value.fullDocument.gameID;
				let players = await getAll('lobbyPlayers', { gameID: gameID }, client);
				io.to(gameID).emit('lobbyPlayerChange', players);
			}
		},
		client
	);

	watch(
		'lobbyMessages',
		async (value) => {
			if (value.operationType != 'delete') {
				let gameID = value.fullDocument.gameID;
				let messages = await getAll(
					'lobbyMessages',
					{ gameID: gameID },
					client
				);
				io.to(gameID).emit('lobbyMessageReceived', messages);
			}
		},
		client
	);

	watch(
		'lobbies',
		async (value) => {
			if (
				value.operationType == 'update' &&
				value.updateDescription.updatedFields.gameStarted
			) {
				let lobby = await get('lobbies', { gameStarted: true }, client);
				let gameID = lobby.gameID;
				remove('lobbies', { gameID: gameID }, client);
				removeAll('lobbyMessages', { gameID: gameID }, client);
				removeAll('lobbyPlayers', { gameID: gameID }, client);

				io.to(gameID).emit('gameStarted');
			}
		},
		client
	);
};
