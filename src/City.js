let random = require('random-words');

module.exports = class City {
	constructor(gameID, database) {
		this.gameID = gameID;
		this.database = datbase;

		this.refGame = database.ref('games/' + gameID);
		this.refCities = this.refGame.child('cities');

		this.refCities.update({
			[randomWords()]: {
				netWorth: 1,
			},
		});
	}
};
