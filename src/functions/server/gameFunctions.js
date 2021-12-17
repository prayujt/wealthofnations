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
	watchFull,
	match,
	remove,
	removeAll,
} = require('../../global');

exports.serverGameFunctions = async (client, io, gameID) => {
	let tileWatch = watchFull(
		'map',
		async (value) => {
			if (value.operationType == 'update') {
				io.to(gameID).emit('tileChange', value.fullDocument);
			}
		},
		client
	);
};
