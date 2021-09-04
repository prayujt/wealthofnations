const {
	connect,
	createTable,
	dropTable,
	get,
	insert,
	exists,
	update,
	replace,
} = require('../global');

let db = require('rethinkdb');

exports.gameFunctions = async (connection, socket) => {
	// insert server-side function calls to events/ files
	let gameID_ = 0;
	let username_ = '';
	let uuid_ = '';

	socket.on('joinGame', async (gameID, uuid, username, response) => {
		let gameExists = await exists('lobbies', gameID, connection);
		let status = true;
		if (gameExists && gameID != '') {
			await replace('lobbyPlayers', uuid, connection, {
				gameID: gameID,
				uuid: uuid,
				username: username,
			});
			await insert('lobbyMessages', connection, {
				gameID: gameID,
				author: 'System',
				message: username + ' has joined the lobby.',
			});
			socket.join(gameID);
			gameID_ = gameID;
			username_ = username;
			uuid_ = uuid;
		} else {
			status = false;
		}

		let values = await get('lobbyPlayers', { gameID: gameID_ }, connection);
		values.toArray().then((result) => {
			console.log(gameID_, result);
		});
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
		await replace('lobbyPlayers', uuid, connection, {
			gameID: gameID,
			uuid: uuid,
			username: username,
		});

		socket.join(gameID);

		gameID_ = gameID;
		username_ = username;
		uuid_ = uuid;
		//db.table('lobbyPlayers').filter({gameID: gameID_})
		let values = await get('lobbyPlayers', { gameID: gameID_ }, connection);
		values.toArray().then((result) => {
			console.log(gameID_, result);
		});
		/*db.table('lobbyPlayers').filter({gameID: gameID_}).changes().run(connection, (err, cursor) => {
            console.log('changed', gameID_);
            cursor.each(console.log);
        }); */

		response({
			status: true,
		});
	});

	socket.on('updateLobbyUsername', async (userID, username) => {
		await update('lobbyPlayers', userID, username, connection);
	});

	socket.on('saveLobbySettings', async (settings) => {
		await update('lobbies', 'settings', settings, connection);
	});

	socket.on('addLobbyMessage', async (messageData) => {
		await insert('lobbyMessages', connection, messageData);
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
};
