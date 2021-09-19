const {
	createCollection,
	dropCollection,
	remove,
	removeAll,
	get,
	getAll,
	insert,
	exists,
	update,
	updateField,
	replace,
	watch,
	match,
} = require('../../global');

const { initializeGame } = require('../../events/InitializeGame');

exports.clientLobbyFunctions = async (client, socket) => {
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

		socket.join(uuid);
		socket.join(gameID);

		if (gameExists && gameID != '') {
			let playerExists = await exists('lobbyPlayers', { uuid: uuid }, client);
			if (playerExists) {
				await replace('lobbyPlayers', { uuid: uuid }, player, client);
			} else {
				await insert('lobbyPlayers', player, client);
			}
			await insert('lobbyMessages', message, client);

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

		socket.join(uuid);
		socket.join(gameID);

		let playerExists = await exists('lobbyPlayers', { uuid: uuid }, client);
		if (playerExists) {
			await replace('lobbyPlayers', { uuid: uuid }, player, client);
		} else {
			await insert('lobbyPlayers', player, client);
		}

		gameID_ = gameID;
		username_ = username;
		uuid_ = uuid;

		response({
			status: true,
		});
	});

	socket.on('updateLobbyUsername', async (userID, username) => {
		await updateField(
			'lobbyPlayers',
			{ uuid: userID },
			{ username: username },
			client
		);
	});

	socket.on('saveLobbySettings', async (settings) => {
		await updateField(
			'lobbies',
			{ gameID: gameID_ },
			{ settings: settings },
			client
		);
	});

	socket.on('clientSendLobbyMessage', async (messageData) => {
		await insert('lobbyMessages', messageData, client);
	});

	socket.on('leavingLobby', async (userID, username, isHost, response) => {
		let players = await getAll('lobbyPlayers', { gameID: gameID_ }, client);
		let playerFound = false;
		if (isHost) {
			for (const [key, value] of Object.entries(players)) {
				if (value.uuid != userID) {
					updateField(
						'lobbies',
						{ gameID: gameID_ },
						{ host: value.uuid },
						client
					);
					insert(
						'lobbyMessages',
						{
							gameID: gameID_,
							author: 'System',
							message:
								'Host has left the lobby. New host is: ' + value.username,
						},
						client
					);
					playerFound = true;
					socket.to(value.uuid).emit('isNewHost');
					break;
				}
			}
			if (!playerFound) {
				remove('lobbies', { gameID: gameID_ }, client);
				removeAll('lobbyMessages', { gameID: gameID_ }, client);
			}
		} else if (!isHost) {
			await insert(
				'lobbyMessages',
				{
					gameID: gameID_,
					author: 'System',
					message: username + ' has left the lobby.',
				},
				client
			);
			socket.leave(gameID_);
		}
		remove('lobbyPlayers', { uuid: userID }, client);
		response({
			status: true,
		});
	});

	socket.on('startGameInitialization', async () => {
		await initializeGame(gameID_, client);
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
};
