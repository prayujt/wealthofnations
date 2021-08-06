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

		this.refLobbySettings.once('value').then((snapshot) => {
			this.refGameSettings.set(snapshot.val());
		});

		this.refLobbyPlayers.once('value').then((snapshot) => {
			for (const [key, value] of Object.entries(snapshot.val())) {
				new Player(id, key, value, database);
			}
		});

		//this.refLobby.remove();
	}

	createNewGame = async () => {
		let settings = await this.getSettings();
		let numCities = settings['numCities'];

		for (let i = 0; i < numCities; i++) {
			new City(this.id, this.database);
		}
	};

	getID = () => {
		return this.id;
	};

	getSettings = async () => {
		let snapshot = await this.refGameSettings.once('value');
		return snapshot.val();
		// then((snapshot) => {
		// let value = snapshot.val();
		// // console.log(value);
		// return value;
		// });
	};

	getPlayers = async () => {
		this.refGamePlayers.once('value').then((snapshot) => {
			return snapshot.val();
		});
	};

	getCities = async () => {};

	getCity = async () => {};
};
