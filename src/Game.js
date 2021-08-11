const City = require('./City');
const Player = require('./Player');

module.exports = class Game {
	constructor(id, database) {
		this.id = id;
		this.database = database;

		console.log('Started Game #' + id);

		this.refGame = database.ref('games/' + id);
		this.refGameSettings = this.refGame.child('settings');
		this.refGamePlayers = this.refGame.child('players');
		this.refCompanies = this.refGame.child('companies');
		this.refCities = this.refGame.child('cities');

		this.refLobby = database.ref('lobbies/' + id);
		this.refLobbySettings = this.refLobby.child('settings');
		this.refLobbyPlayers = this.refLobby.child('players');

		this.refServer = database.ref('server/' + id);

		this.refLobbySettings.once('value').then((snapshot) => {
			this.refGameSettings.set(snapshot.val());
			this.refLobbyPlayers.once('value').then((snapshot) => {
				for (const [key, value] of Object.entries(snapshot.val())) {
					new Player(id, key, value, database);
				}

				this.refGameSettings.once('value', (snapshot) => {
					let numCities = snapshot.val()['numCities'];

					for (let i = 0; i < numCities; i++) {
						new City(this.id, numCities, this.database);
					}

					this.refServer.update({
						initializingGame: false,
					});
				});
			});
		});
	}

	getID = () => {
		return this.id;
	};

	getSettings = async () => {
		let snapshot = await this.refGameSettings.once('value');
		return snapshot.val();
	};

	getPlayers = async () => {
		this.refGamePlayers.once('value').then((snapshot) => {
			return snapshot.val();
		});
	};

	getCities = async () => {};

	getCity = async () => {};
};
