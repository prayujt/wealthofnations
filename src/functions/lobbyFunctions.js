const { connect, createTable, insert, exists } = require('../global');

exports.gameFunctions = async (connection, socket) => {
	// insert server-side function calls to events/ files
	createTable('lobbies', 'gameID', connection, () => {});
	createTable('lobbyPlayers', 'uuid', connection, () => {});

	socket.on('joinGame', async (gameID) => {
		let gameExists = await exists('lobbies', gameID);
		if (gameExists && gameID != '') {
			insert('lobbyPlayers', connection, {
				[socket.uuid]: socket.username,
			});
			socket.game = gameID;
			return true;
		} else {
			return false;
		}
		/*refMessages.push({
            author: 'System',
            message: username + ' has joined the lobby.',
        });
        */
	});

	socket.on('createGame', async (gameID) => {
		insert('lobbies', connection, {
			gameID: gameID,
			gameStarted: false,
			host: socket.uuid,
			players: {
				[socket.uuid]: socket.username,
			},
			settings: {
				type: 'timed',
				numCities: 10,
			},
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
