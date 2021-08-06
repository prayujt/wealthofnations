module.exports = class Player {
	constructor(gameID, uuid, username, database) {
		this.gameID = gameID;
		this.uuid = uuid;
		this.username = username;

		this.database = database;
		this.refGame = database.ref('games/' + gameID);
		this.refPlayers = this.refGame.child('players');
		this.refPlayer = this.refPlayers.child(uuid);
		this.refStats = this.refPlayer.child('stats');
		this.refCompanies = this.refPlayer.child('companies');

		let initPlayerStats = {
			username: username,
			netWorth: 1000000,
			debt: 0,
			balance: 1000000,
			influence: 100,
			bankrupt: false,
			companies: [],
		};

		this.refStats.set(initPlayerStats);

		console.log('Initialized Player with ID ' + uuid);
	}

	getGameID = () => {
		return this.gameID;
	};

	getUsername = () => {
		return this.username;
	};

	getUUID = () => {
		return this.uuid;
	};

	getDatabase = () => {
		return this.database;
	};

	getPlayerStats = () => {
		this.refStats.once('value').then((snapshot) => {
			return snapshot.val();
		});
	};

	getCompanies = () => {
		this.refCompanies.once('value').then((snapshot) => {
			return snapshot.val();
		});
	};

	updatePlayerStats = (key, value) => {
		this.refStats.update({
			key: value,
		});
	};
};
