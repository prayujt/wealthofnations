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
	dropDatabase,
} = require('../../global');

const { initializeGame } = require('../../events/InitializeGame');

exports.clientLobbyFunctions = async (client, socket) => {
	socket.on('updateLobbyUsername', async (userID, username) => {
		await updateField(
			'players',
			{ uuid: userID },
			{ username: username },
			client
		);
	});

	socket.on('saveLobbySettings', async (settings) => {
		await updateField(
			'game',
			{ gameID: socket.gameID },
			{ settings: settings },
			client
		);
	});

	socket.on('clientSendLobbyMessage', async (messageData) => {
		await insert('messages', messageData, client);
	});

	socket.on('leaveLobby', async (userID, username, isHost, response) => {
		let players = await getAll('players', {}, client);
		let playerFound = false;
		if (isHost) {
			for (const [key, value] of Object.entries(players)) {
				if (value.uuid != userID) {
					updateField('game', {}, { host: value.uuid }, client);
					insert(
						'messages',
						{
							type: 'lobby',
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
				dropDatabase(client);
			}
		} else if (!isHost) {
			await insert(
				'messages',
				{
					type: 'lobby',
					author: 'System',
					message: username + ' has left the lobby.',
				},
				client
			);
			socket.leave(socket.gameID);
			socket.leave(userID);
		}
		remove('players', { uuid: userID }, client);
		response({
			status: true,
		});
		socket.removeAllListeners('startGameInitialization');
		socket.removeAllListeners('clientSendLobbyMessage');
		socket.removeAllListeners('updateLobbyUsername');
	});

	socket.on('startGameInitialization', async (response) => {
		await initializeGame(socket.gameID, client);
		socket.to(socket.gameID).emit('gameStarted');
		response({
			status: true,
		});
	});
};
