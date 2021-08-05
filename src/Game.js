module.exports = class Game {
	constructor(id, database) {
		this.id = id;
		this.database = database;
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
					database
						.ref('games/' + id)
						.child('players')
						.child(key)
						.set({
							username: value,
							netWorth: 1000000,
							debt: 0,
							balance: 1000000,
							influence: 100,
							bankrupt: false,
						});
				}
			});

		database.ref('lobbies/' + id).remove();
	}

	getID = () => {
		return this.id;
	};

	getPlayers = () => {};
};
