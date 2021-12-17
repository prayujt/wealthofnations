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

const { serverGameFunctions } = require('./gameFunctions');

exports.serverLobbyFunctions = async (client, io, gameID) => {
	let messageIndex = 0;
	let playersWatch = watch(
		'players',
		async (value) => {
			let players = await getAll('players', {}, client);
			io.to(gameID).emit('lobbyPlayerChange', players);
		},
		client
	);

	let messagesWatch = watch(
		'messages',
		async (value) => {
			if (value.operationType != 'delete') {
				io.to(gameID).emit(
					'lobbyMessageReceived',
					value.fullDocument,
					messageIndex
				);
				messageIndex++;
			}
		},
		client
	);
	let gameStartedWatch = watch(
		'game',
		async (value) => {
			if (value.operationType == 'update') {
				if ('gameStarted' in value.updateDescription.updatedFields) {
					if (value.updateDescription.updatedFields.gameStarted == true) {
						await playersWatch.close();
						await messagesWatch.close();
						await gameStartedWatch.close();
						serverGameFunctions(client, io, gameID);
					}
				}
			}
		},
		client
	);
};
