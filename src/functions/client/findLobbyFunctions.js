const {
	connect,
	databaseExists,
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

const { clientLobbyFunctions } = require('./lobbyFunctions');
const { serverLobbyFunctions } = require('../server/lobbyFunctions');

exports.clientFindLobbyFunctions = async (socket, client, io) => {
	socket.on('joinLobby', async (gameID, uuid, username, response) => {
		let gameExists = await databaseExists(
			'wealthofnations' + gameID.toString(),
			client
		);
		let status = true;
		let player = {
			gameID: gameID,
			uuid: uuid,
			username: username,
		};
		let message = {
			author: 'System',
			type: 'lobby',
			message: username + ' has joined the lobby.',
		};

		if (gameExists && gameID != '') {
			connect('wealthofnations' + gameID.toString(), async (newClient) => {
				let playerExists = await exists('players', { uuid: uuid }, newClient);
				if (playerExists) {
					await replace('players', { uuid: uuid }, player, newClient);
				} else {
					await insert('players', player, newClient);
				}

				socket.join(uuid);
				socket.join(gameID);
				socket.gameID = gameID;
				socket.username = username;
				socket.uuid = uuid;

				await insert('messages', message, newClient);
				clientLobbyFunctions(newClient, socket);
			});
		} else {
			status = false;
		}

		response({
			status: status,
		});
	});

	socket.on('createLobby', async (gameID, uuid, username, response) => {
		socket.join(uuid);
		socket.join(gameID);
		socket.gameID = gameID;
		socket.username = username;
		socket.uuid = uuid;

		connect('wealthofnations' + gameID.toString(), async (newClient) => {
			await insert(
				'game',
				{
					gameID: gameID,
					gameStarted: false,
					host: uuid,
					settings: {},
				},
				newClient
			);

			serverLobbyFunctions(newClient, io, gameID);
			let player = {
				gameID: gameID,
				uuid: uuid,
				username: username,
			};

			let playerExists = await exists('players', { uuid: uuid }, newClient);
			if (playerExists) {
				await replace('players', { uuid: uuid }, player, newClient);
			} else {
				await insert('players', player, newClient);
			}

			clientLobbyFunctions(newClient, socket);
		});

		response({
			status: true,
		});
	});
};
