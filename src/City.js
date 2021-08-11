const Company = require('./Company');
let random = require('fakerator');

module.exports = class City {
	constructor(gameID, numCities, database) {
		this.gameID = gameID;
		this.database = database;

		this.refGame = database.ref('games/' + gameID);
		this.refCities = this.refGame.child('cities');
		this.refCompanies = this.refGame.child('companies');
		this.refServer = database.ref('server/' + gameID);

		this.refGameSettings = this.refGame.child('settings');

		this.cityName = random().address.city();

		const probabilities = [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5,
		];
		const populationRanges = {
			1: [0, 25000],
			2: [25001, 50000],
			3: [50001, 150000],
			4: [150001, 300000],
			5: [300001, 1000000],
		};
		const companyRanges = {
			1: [3, 5],
			2: [5, 8],
			3: [8, 12],
			4: [12, 16],
			5: [16, 25],
		};

		this.initialTier =
			probabilities[Math.floor(Math.random() * probabilities.length)];
		this.initialPopulation = Math.floor(
			Math.random() *
				(populationRanges[this.initialTier][0] -
					populationRanges[this.initialTier][1] +
					1) +
				populationRanges[this.initialTier][1]
		);

		this.initialNumCompanies = Math.floor(
			Math.random() *
				(companyRanges[this.initialTier][0] -
					companyRanges[this.initialTier][1] +
					1) +
				companyRanges[this.initialTier][1]
		);
		this.initialNetWorth = 0;

		let companies = [];

		for (let i = 0; i < this.initialNumCompanies; i++) {
			let company = new Company(this.gameID, this.cityName, this.database);
			this.initialNetWorth += company.initialNetWorth;
			companies.push(company.companyName);
		}

		this.refCities.update({
			[this.cityName]: {
				companies: companies,
				netWorth: this.initialNetWorth,
				owner: 'Bank',
				population: this.initialPopulation,
				tier: this.initialTier,
			},
		});

		this.refServer.update({
			initializingGame: false,
		});
	}
};
