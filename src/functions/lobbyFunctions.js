const {
	connect,
	createTable,
	dropTable,
	insert,
	exists,
} = require('../global');

exports.gameFunctions = async (connection, socket) => {
	// insert server-side function calls to events/ files

	socket.on('joinGame', async (gameID, uuid, username, response) => {
		let gameExists = await exists('lobbies', gameID, connection);
		let status = true;
		if (gameExists && gameID != '') {
			await insert('lobbyPlayers', connection, {
				gameID: gameID,
				uuid: uuid,
				username: username,
			});
			await insert('lobbyMessages', connection, {
				gameID: gameID,
				author: 'System',
				message: username + ' has joined the lobby.',
			});
		} else {
			status = false;
		}
		response({
			status: status,
		});
	});

	socket.on('createGame', async (gameID, uuid, username, response) => {
		await insert('lobbies', connection, {
			gameID: gameID,
			gameStarted: false,
			host: uuid,
			settings: {
				type: 'timed',
				numCities: 10,
			},
		});
		await insert('lobbyPlayers', connection, {
			gameID: gameID,
			uuid: uuid,
			username: username,
		});
		response({
			status: true,
		});
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
};
