module.exports = class Game {
	constructor(id, database) {
		this.id = id;
		this.database = database;
		console.log('Started Game #' + id);

		let refGame = database.ref('games/' + id);
		let refGameSettings = refGame.child('settings');
		let refGamePlayers = refGame.child('players');
		let refCompanies = refGame.child('companies');
		let refCities = refGame.child('cities');

		let refLobby = database.ref('lobbies/' + id);
		let refLobbySettings = refLobby.child('settings');
		let refLobbyPlayers = refLobby.child('players');

		refLobbySettings.once('value').then((snapshot) => {
			refGameSettings.set(snapshot.val());
		});

		refLobbyPlayers.once('value').then((snapshot) => {
			for (const [key, value] of Object.entries(snapshot.val())) {
				refGamePlayers.child(key).set({
					username: value,
					netWorth: 1000000,
					debt: 0,
					balance: 1000000,
					influence: 100,
					bankrupt: false,
				});
			}
		});

		refCompanies.set({
			name: 'google',
			netWorth: 10000000000000,
		});

		refCities.set({
			name: 'tampa',
			netWorth: 32131232131,
		});

		database.ref('lobbies/' + id).remove();
	}

	getID = () => {
		return this.id;
	};

	getPlayers = () => {};
};
