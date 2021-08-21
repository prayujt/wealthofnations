const random = require('fakerator');

const cityTierProbabilities = [
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5,
];
const companyTierProbabilities = [
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2,
	2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4,
	4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7,
];
const populationRanges = {
	1: [1000, 25000],
	2: [25001, 50000],
	3: [50001, 150000],
	4: [150001, 300000],
	5: [300001, 1000000],
};
const numCompaniesRanges = {
	1: [3, 5],
	2: [6, 9],
	3: [10, 14],
	4: [15, 18],
	5: [19, 25],
};
const netWorthRanges = {
	1: [1000000, 10000000],
	2: [10000001, 50000000],
	3: [50000001, 100000000],
	4: [100000001, 500000000],
	5: [500000001, 1000000000],
	6: [1000000001, 5000000000],
	7: [10000000001, 50000000000],
	8: [50000000001, 100000000000],
	9: [100000000001, 500000000000],
	10: [500000000001, 1000000000000],
};
const employeesRanges = {
	1: [1000, 2500],
	2: [2501, 5000],
	3: [5001, 10000],
	4: [10001, 15000],
	5: [15001, 25000],
	6: [25001, 50000],
	7: [50001, 100000],
	8: [100001, 150000],
	9: [150001, 250000],
	10: [250001, 1000000],
};

let cities = [];

const initializeGame = async (id, database) => {
	console.log('Started Game #' + id);
	let refGame = database.ref('games/' + id);
	let refGameSettings = refGame.child('settings');

	let refLobby = database.ref('lobbies/' + id);
	let refLobbySettings = refLobby.child('settings');
	let refLobbyPlayers = refLobby.child('players');

	let refServer = database.ref('server/' + id);

	let settings = await refLobbySettings.once('value');
	refGameSettings.set(settings.val());

	let numCities = settings.val()['numCities'];

	for (let i = 0; i < numCities; i++) {
		await createCity(id, numCities, database);
	}

	let players = await refLobbyPlayers.once('value');
	for (const [key, value] of Object.entries(players.val())) {
		await createPlayer(id, key, value, database);
	}

	refServer.update({
		initializingGame: false,
	});
};

const createPlayer = async (gameID, uuid, username, database) => {
	let refStats = database
		.ref('games/' + gameID)
		.child('players')
		.child(uuid)
		.child('stats');
	refStats.set({
		username: username,
		netWorth: 6000000,
		debt: 0,
		balance: 5000000,
		influence: 100,
		bankrupt: false,
		companies: [],
	});
	let name = username + ' LLC Inc';
	console.log('Initialized Player with ID ' + uuid);
	await createConglomerate(gameID, uuid, username, name, database);
};

const createCity = async (gameID, numCities, database) => {
	let name = random().address.city();
	cities.push(name);

	let refCities = database.ref('games/' + gameID).child('cities');

	let tier =
		cityTierProbabilities[
			Math.floor(Math.random() * cityTierProbabilities.length)
		];

	let numCompanies = Math.floor(
		Math.random() *
			(numCompaniesRanges[tier][0] - numCompaniesRanges[tier][1] + 1) +
			numCompaniesRanges[tier][1]
	);

	let netWorth = 0;
	let population = 0;

	let companies = [];

	for (let i = 0; i < numCompanies; i++) {
		let companyData = await createCompany(gameID, name, database);
		companies.push(companyData[0]);
		netWorth += companyData[1];
		population += companyData[2];
	}

	tier = getTier(population);

	refCities.update({
		[name]: {
			companies: companies,
			netWorth: netWorth,
			owner: 'Bank',
			population: population,
			tier: tier,
		},
	});
};

const createCompany = async (gameID, city, database) => {
	let refCompanies = database.ref('games/' + gameID).child('companies');

	let name = random().company.name().replace('.', '');

	let tier =
		companyTierProbabilities[
			Math.floor(Math.random() * companyTierProbabilities.length)
		];

	let netWorth = Math.floor(
		Math.random() * (netWorthRanges[tier][0] - netWorthRanges[tier][1] + 1) +
			netWorthRanges[tier][1]
	);

	let employees = Math.floor(
		Math.random() * (employeesRanges[tier][0] - employeesRanges[tier][1] + 1) +
			employeesRanges[tier][1]
	);

	let debt = 0;

	refCompanies.update({
		[name]: {
			city: city,
			owner: 'Bank',
			netWorth: netWorth,
			employees: employees,
			debt: debt,
			bankrupt: false,
			holders: {
				Bank: {
					percent: 100,
					marketValue: netWorth,
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
			tier: tier,
		},
	});

	return [name, netWorth, employees];
};

const createConglomerate = async (gameID, uuid, username, name, database) => {
	let refConglomerate = database
		.ref('games/' + gameID)
		.child('players/' + uuid)
		.child('conglomerate');

	let startingCity = cities[Math.floor(Math.random() * cities.length)];

	refConglomerate.update({
		[name]: {
			city: startingCity,
			owner: uuid,
			netWorth: netWorthRanges[1][0],
			employees: employeesRanges[1][0],
			debt: 0,
			bankrupt: false,
			holders: {
				[uuid]: {
					percent: 100,
					marketValue: netWorthRanges[1][0],
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
			tier: 1,
		},
	});
};

const getTier = (population) => {
	for (const [key, value] of Object.entries(populationRanges)) {
		if (population < value[1] && population > value[0]) {
			return key;
		}
	}
	return 0;
};

exports.initializeGame = initializeGame;
