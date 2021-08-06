const Player = require('./Player');

module.exports = class Game {
	constructor(id, database) {
		this.id = id;
		this.database = database;
		this.players = [];

		console.log('Started Game #' + id);

		database
			.ref('lobbies/' + id)
			.child('settings')
			.once('value')
			.then((snapshot) => {
				database
					.ref('games/' + id)
					.child('settings')
					.set(snapshot.val());
			});

		database
			.ref('lobbies/' + id)
			.child('players')
			.once('value')
			.then((snapshot) => {
				for (const [key, value] of Object.entries(snapshot.val())) {
					this.players.push(new Player(id, key, value, database));
				}
			});

		database.ref('lobbies/' + id).remove();
	}

	getID = () => {
		return this.id;
	};

	getPlayers = () => {};
};
