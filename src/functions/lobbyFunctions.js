const {
	createTable,
	dropTable,
	get,
	insert,
	exists,
	update,
	replace,
	watch,
	match,
} = require('../global');

exports.gameFunctions = async (client, socket) => {
	// insert server-side function calls to events/ files
	let gameID_ = 0;
	let username_ = '';
	let uuid_ = '';

	socket.on('joinGame', async (gameID, uuid, username, response) => {
		let gameExists = await exists('lobbies', { gameID: gameID }, client);
		let status = true;
		let player = {
			gameID: gameID,
			uuid: uuid,
			username: username,
		};
		let message = {
			gameID: gameID,
			author: 'System',
			message: username + ' has joined the lobby.',
		};

		if (gameExists && gameID != '') {
			let playerExists = await exists('lobbyPlayers', { uuid: uuid }, client);
			if (playerExists) {
				await replace('lobbyPlayers', { uuid: uuid }, player, client);
			} else {
				await insert('lobbyPlayers', player, client);
			}
			await insert('lobbyMessages', message, client);

			socket.join(gameID);
			gameID_ = gameID;
			username_ = username;
			uuid_ = uuid;
		} else {
			status = false;
		}

		response({
			status: status,
		});
	});

	socket.on('createGame', async (gameID, uuid, username, response) => {
		await insert(
			'lobbies',
			{
				gameID: gameID,
				gameStarted: false,
				host: uuid,
				settings: {
					type: 'timed',
					numCities: 10,
				},
			},
			client
		);

		let player = {
			gameID: gameID,
			uuid: uuid,
			username: username,
		};

		let playerExists = await exists('lobbyPlayers', { uuid: uuid }, client);
		if (playerExists) {
			await replace('lobbyPlayers', { uuid: uuid }, player, client);
		} else {
			await insert('lobbyPlayers', player, client);
		}

		socket.join(gameID);

		gameID_ = gameID;
		username_ = username;
		uuid_ = uuid;

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

	socket.on('clientSendLobbyMessage', async (messageData) => {
		await insert('lobbyMessages', connection, messageData);
	});

	watch(
		'lobbyPlayers',
		(value) => {
			console.log(value);
		},
		client
	);
	// let thing = next.documentKey._id;
	// console.log(typeof(thing));
	// let thing2 = thing.substring(thing.indexOf('"'));
	// console.log(thing2);
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
};
