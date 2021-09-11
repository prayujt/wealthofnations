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
} = require('../../global');

exports.serverLobbyFunctions = async (client, io) => {
	watch(
		'lobbyPlayers',
		(value) => {
			console.log(value.fullDocument);
			// console.log(value);
		},
		client
	);
};
