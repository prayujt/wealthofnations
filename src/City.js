const Company = require('./Company');
let random = require('fakerator');

module.exports = class City {
	constructor(gameID, numCities, database) {
		this.gameID = gameID;
		this.database = database;

		this.refGame = database.ref('games/' + gameID);
		this.refCities = this.refGame.child('cities');
		this.refServer = database.ref('server/' + gameID);

		this.refGameSettings = this.refGame.child('settings');

		this.cityName = random().address.city();

		let numCompanies = Math.floor(Math.random() * (25 - 5 + 1) + 5);
		let companies = [];

		for (let i = 0; i < numCompanies; i++) {
			let company = new Company(this.gameID, this.cityName, this.database);
			companies.push(company.companyName);
		}

		this.refCities.update({
			[this.cityName]: {
				companies: companies,
				netWorth: 1,
				owner: 'Bank',
				population: 0, //TODO: Calculate population
			},
		});

		this.refServer.update({
			initializingGame: false,
		});
	}
};
