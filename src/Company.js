let random = require('fakerator');
module.exports = class Company {
	constructor(gameID, city, database) {
		this.gameID = gameID;
		this.database = database;

		this.refGame = database.ref('games/' + gameID);
		this.refCities = this.refGame.child('cities');
		this.refServer = database.ref('server/' + gameID);
		this.refCompanies = this.refGame.child('companies');

		this.companyName = random().address.city();
		this.city = city;

		this.refCompanies.update({
			[this.companyName]: {
				city: city,
				owner: 'Bank',
				netWorth: 1,
				employees: 1,
				debt: 0,
				bankrupt: false,
				holders: {
					Bank: {
						percent: 100,
						marketValue: 1,
					},
				},
				expenses: {
					employeeWages: 0,
					executiveWages: 0,
					maintenanceFees: 0,
					interestPayments: 0,
					localTax: 0,
				},
				revenue: {
					expectedGrowth: 0,
					volatilty: 0,
				},
				secrets: {},
			},
		});
	}
};
