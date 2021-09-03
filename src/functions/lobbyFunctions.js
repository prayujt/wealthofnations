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
		let gameExists = await exists('lobbies', gameID);
		let status = true;
		if (gameExists && gameID != '') {
			insert('lobbyPlayers', connection, {
				gameID: gameID,
				uuid: uuid,
				username: username,
			});
		} else {
			status = false;
		}
		response({
			status: status,
		});
		/*refMessages.push({
            author: 'System',
            message: username + ' has joined the lobby.',
        });
        */
	});

	socket.on('createGame', async (gameID, uuid, username, response) => {
		insert('lobbies', connection, {
			gameID: gameID,
			gameStarted: false,
			host: uuid,
			/*players: {
				[uuid]: username,
			},
			*/
			settings: {
				type: 'timed',
				numCities: 10,
			},
		});
		insert('lobbyPlayers', connection, {
			gameID: gameID,
			uuid: uuid,
			username: username,
		});
		response({
			status: true,
		});
	});

	/*createTable('players', 'username', connection, () => {
        insert('players', connection, {
			username: 'kaniel',
			netWorth: 6000000,
			debt: 0,
			balance: 5000000,
			influence: 100,
			bankrupt: false,
			companies: ['BoA'],
		});
    });
    */
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
};
