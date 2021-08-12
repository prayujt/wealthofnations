let random = require('fakerator');
module.exports = class Company {
	constructor(gameID, city, database) {
		this.gameID = gameID;
		this.database = database;

		this.refGame = database.ref('games/' + gameID);
		this.refCities = this.refGame.child('cities');
		this.refServer = database.ref('server/' + gameID);
		this.refCompanies = this.refGame.child('companies');

		this.companyName = random().company.name().replace('.', '');
		this.city = city;

		this.initialNetWorth = 1;
		this.initialEmployees = 1;
		this.initialDebt = 0;

		this.refCompanies.update({
			[this.companyName]: {
				city: city,
				owner: 'Bank',
				netWorth: this.initialNetWorth,
				employees: this.initialEmployees,
				debt: this.initialDebt,
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
