const random = require('fakerator');

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

	let players = await refLobbyPlayers.once('value');
	for (const [key, value] of Object.entries(players.val())) {
		await createPlayer(id, key, value, database);
	}

	let numCities = settings.val()['numCities'];

	for (let i = 0; i < numCities; i++) {
		await createCity(id, numCities, database);
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
		netWorth: 1000000,
		debt: 0,
		balance: 1000000,
		influence: 100,
		bankrupt: false,
		companies: [],
	});
	console.log('Initialized Player with ID ' + uuid);
};

const createCity = async (gameID, numCities, database) => {
	let name = random().address.city();

	let refCities = database.ref('games/' + gameID).child('cities');

	let tier = probabilities[Math.floor(Math.random() * probabilities.length)];
	let population = Math.floor(
		Math.random() *
			(populationRanges[tier][0] - populationRanges[tier][1] + 1) +
			populationRanges[tier][1]
	);

	let numCompanies = Math.floor(
		Math.random() * (companyRanges[tier][0] - companyRanges[tier][1] + 1) +
			companyRanges[tier][1]
	);
	let netWorth = 0;

	let companies = [];

	for (let i = 0; i < numCompanies; i++) {
		let companyData = await createCompany(gameID, name, database);
		netWorth += companyData[0];
		companies.push(companyData[1]);
	}

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

	let netWorth = 1;
	let employees = 1;
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

	return [netWorth, name];
};

exports.initializeGame = initializeGame;
