const random = require('fakerator');
const {
	createCollection,
	dropCollection,
	remove,
	removeAll,
	get,
	getAll,
	insert,
	exists,
	update,
	updateField,
	replace,
	watch,
	match,
} = require('../global');

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
	1: [25, 50],
	2: [51, 100],
	3: [101, 250],
	4: [251, 500],
	5: [501, 1000],
	6: [1001, 2500],
	7: [2501, 5000],
	8: [5001, 10000],
	9: [10001, 25000],
	10: [25000, 100000],
};
const employeeWageRanges = {
	1: [15000, 16000],
	2: [16001, 17000],
	3: [17001, 18000],
	4: [18001, 20000],
	5: [20001, 21500],
	6: [21501, 22500],
	7: [22501, 24000],
	8: [24001, 26000],
	9: [26001, 28000],
	10: [28001, 30000],
};
const executiveWageRanges = {
	1: [25000, 27500],
	2: [27501, 30000],
	3: [30001, 35000],
	4: [35001, 40000],
	5: [40001, 45000],
	6: [45001, 50000],
	7: [50001, 55000],
	8: [55001, 60000],
	9: [60001, 65000],
	10: [65001, 100000],
};

let cities = [];

const initializeGame = async (gameID, client) => {
	console.log('Started Game #' + gameID);

	let game = await get('game', {}, client);

	let numCities = game.settings.numCities;
	let numCols = Math.round(Math.sqrt(Math.sqrt(numCities)) * numCities);
	let numRows = numCols;

	for (let i = 0; i < numCities; i++) {
		await createCity(i, numCities, client);
	}

	let players = await getAll('players', {}, client);
	for (const [key, value] of Object.entries(players)) {
		await createPlayer(value.uuid, value.username, client);
	}

	let cityCount = 0;
	let cityTiles = Array.from({ length: numRows }, () =>
		Array.from({ length: numCols }, () => -1)
	);
	while (cityCount < numCities) {
		let rowNum = Math.round(Math.random() * numRows);
		let colNum = Math.round(Math.random() * numCols);
		console.log(rowNum);
		console.log(colNum);
		if (cityTiles[rowNum][colNum] == -1) {
			cityTiles[rowNum][colNum] = cityCount;
			cityCount++;
		}
	}

	for (let i = 0; i < numRows; i++) {
		for (let j = 0; j < numCols; j++) {
			await createTile(i, j, cityTiles[i][j], client);
		}
	}

	await updateField('game', {}, { gameStarted: true }, client);
};

const createPlayer = async (uuid, username, client) => {
	updateField(
		'players',
		{ uuid: uuid },
		{
			netWorth: 6000000,
			debt: 0,
			balance: 5000000,
			influence: 100,
			bankrupt: false,
			companies: [],
		},
		client
	);

	let name = username + ' LLC Inc';
	console.log('Initialized Player with ID ' + uuid);
	await createConglomerate(uuid, username, name, client);
};

const createCity = async (index, numCities, client) => {
	let name = random().address.city();
	cities.push(name);

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
		let companyData = await createCompany(name, client);
		companies.push(companyData[0]);
		netWorth += companyData[1];
		population += companyData[2];
	}

	tier = getTier(population);

	insert(
		'cities',
		{
			index: index,
			name: name,
			companies: companies,
			netWorth: netWorth,
			owner: 'Bank',
			population: population,
			tier: tier,
		},
		client
	);
};

const createCompany = async (city, client) => {
	let name = random().company.name().replace('.', '');

	let tier =
		companyTierProbabilities[
			Math.floor(Math.random() * companyTierProbabilities.length)
		];

	let netWorth = Math.floor(
		Math.random() * (netWorthRanges[tier][0] - netWorthRanges[tier][1] + 1) +
			netWorthRanges[tier][1]
	);

	let totalEmployees = Math.floor(
		Math.random() * (employeesRanges[tier][0] - employeesRanges[tier][1] + 1) +
			employeesRanges[tier][1]
	);

	let executives = Math.floor(Math.round(totalEmployees / 10));
	let employees = totalEmployees - executives;

	let employeeWage = Math.floor(
		Math.random() *
			(employeeWageRanges[tier][0] - employeeWageRanges[tier][1] + 1) +
			employeeWageRanges[tier][1]
	);

	let executiveWage = Math.floor(
		Math.random() *
			(executiveWageRanges[tier][0] - executiveWageRanges[tier][1] + 1) +
			executiveWageRanges[tier][1]
	);

	let ceoWage = Math.floor(Math.round(1.5 * executiveWage));

	let debt = Math.floor(Math.round(netWorth / 2));

	let taxRate = 5;

	let employeeWages = employees * employeeWage;
	let executiveWages = executives * executiveWage;
	let maintenanceFees = Math.floor(Math.round(netWorth / 10));
	let interestPayments = Math.floor(Math.round(debt / 10));
	let localTax = Math.floor(Math.round(netWorth / (100 / taxRate)));
	let totalExpenses = Math.floor(
		Math.round(
			employeeWages +
				executiveWages +
				maintenanceFees +
				interestPayments +
				localTax
		)
	);

	let currentRevenue = Math.floor(Math.round(netWorth / 1.5));
	let expectedGrowth = 3;
	let volatility = 5;

	insert(
		'companies',
		{
			name: name,
			city: city,
			owner: 'Bank',
			netWorth: netWorth,
			employees: employees,
			debt: debt,
			bankrupt: false,
			reserves: 0,
			holders: {
				Bank: {
					percent: 100,
					marketValue: netWorth,
				},
			},
			expenses: {
				employeeWage: employeeWage,
				executiveWage: executiveWage,
				ceoWage: ceoWage,
				taxRate: taxRate,
				employeeWages: employeeWages,
				executiveWages: executiveWages,
				maintenanceFees: maintenanceFees,
				interestPayments: interestPayments,
				localTax: localTax,
				totalExpenses: totalExpenses,
			},
			revenue: {
				currentRevenue: currentRevenue,
				expectedGrowth: expectedGrowth,
				volatility: volatility,
			},
			expectedProfit: Math.floor(
				Math.round(currentRevenue * (1 + expectedGrowth / 100) - totalExpenses)
			),
			secrets: {},
			tier: tier,
		},
		client
	);

	return [name, netWorth, totalEmployees];
};

const createConglomerate = async (uuid, username, name, client) => {
	let startingCity = cities[Math.floor(Math.random() * cities.length)];

	let netWorth = netWorthRanges[1][0];

	let totalEmployees = employeesRanges[1][0];
	let executives = Math.floor(Math.round(totalEmployees / 10));
	let employees = totalEmployees - executives;

	let employeeWage = employeeWageRanges[1][0];
	let executiveWage = executiveWageRanges[1][0];

	let ceoWage = Math.floor(Math.round(1.5 * executiveWage));

	let debt = Math.floor(Math.round(netWorth / 2));

	let taxRate = 5;

	let employeeWages = employees * employeeWage;
	let executiveWages = executives * executiveWage;
	let maintenanceFees = Math.floor(Math.round(netWorth / 10));
	let interestPayments = Math.floor(Math.round(debt / 10));
	let localTax = Math.floor(Math.round(netWorth / (100 / taxRate)));
	let totalExpenses = Math.floor(
		Math.round(
			employeeWages +
				executiveWages +
				maintenanceFees +
				interestPayments +
				localTax
		)
	);

	let currentRevenue = Math.floor(Math.round(netWorth / 1.5));
	let expectedGrowth = 3;
	let volatility = 5;

	updateField(
		'players',
		{ uuid: uuid },
		{
			conglomerate: {
				name: name,
				city: startingCity,
				owner: uuid,
				netWorth: netWorth,
				employees: employees,
				debt: debt,
				bankrupt: false,
				reserves: 0,
				holders: {
					[uuid]: {
						percent: 100,
						marketValue: netWorthRanges[1][0],
					},
				},
				expenses: {
					employeeWage: employeeWage,
					executiveWage: executiveWage,
					ceoWage: ceoWage,
					taxRate: taxRate,
					employeeWages: employeeWages,
					executiveWages: executiveWages,
					maintenanceFees: maintenanceFees,
					interestPayments: interestPayments,
					localTax: localTax,
					totalExpenses: totalExpenses,
				},
				revenue: {
					currentRevenue: currentRevenue,
					expectedGrowth: 0,
					volatility: 0,
				},
				expectedProfit: Math.floor(
					Math.round(
						currentRevenue * (1 + expectedGrowth / 100) - totalExpenses
					)
				),
				secrets: {},
				tier: 1,
			},
		},
		client
	);
};

const createTile = (row, col, cityIndex, client) => {
	let type = 'city';
	if (cityIndex == -1) type = 'empty';
	insert(
		'map',
		{
			type: type,
			city: cityIndex,
			row: row,
			column: col,
		},
		client
	);
	// socket.to(socket.gameID).emit('tileReceived', {
	//     type: type,
	//     city: cityIndex,
	//     row: row,
	//     column: col,
	// });
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
