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

exports.clientGameFunctions = async (client, socket) => {
	socket.on('getTileData', async (row, column, response) => {
		let tile = await get('map', { row: row, column: column }, client);
		response(tile);
	});
	socket.on('getMapSize', async (response) => {
		let array = await getAll('map', {}, client);
		response(
			Math.sqrt(Object.keys(array).length),
			Math.sqrt(Object.keys(array).length)
		);
	});
};
