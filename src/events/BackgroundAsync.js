const backgroundAsync = async (database, key) => {
	let companiesRef = database.ref('games/' + key).child('companies');
	setInterval(async () => {
		let companiesRef = database.ref('games/' + key).child('companies');
		let companies = await companiesRef.once('value');
		for (const [key, value] of Object.entries(companies.val())) {
			let currentRevenue = value['revenue']['currentRevenue'];
			let expectedGrowth = value['revenue']['expectedGrowth'];
			let volatilityFactor = value['revenue']['volatility'];
			let volatilityMin = 0 - volatilityFactor;
			let volatility =
				Math.random() * (volatilityFactor - volatilityMin) + volatilityMin;

			let newRevenue =
				currentRevenue + currentRevenue * ((expectedGrowth + volatility) / 100);
			companiesRef.child(key).child('revenue').update({
				currentRevenue: newRevenue,
			});
		}
	}, 10000);
};

exports.backgroundAsync = backgroundAsync;
