let random = require('random-words');

module.exports = class City {
	constructor(gameID, database) {
		this.gameID = gameID;
		this.database = database;

		this.refGame = database.ref('games/' + gameID);
		this.refCities = this.refGame.child('cities');
		this.refServer = database.ref('server/' + gameID);

		this.refCities.update({
			[random()]: {
				netWorth: 1,
			},
		});

		this.refServer.update({
			initializingGame: false,
		});
	}
};
