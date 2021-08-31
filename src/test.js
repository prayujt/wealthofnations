const db = require('rethinkdb');

db.connect({ host: 'prayujt.com', db: 'wealthofnations' }).then(
	(connection) => {
		db.tableCreate('players', { primaryKey: 'username' }).run(
			connection,
			() => {
				db.table('players')
					.insert({
						username: 'jason',
						netWorth: 6000000,
						debt: 0,
						balance: 5000000,
						influence: 100,
						bankrupt: false,
						companies: ['BoA'],
					})
					.run(connection, (err, result) => {
						if (err) throw err;
						console.log(JSON.stringify(result, null, 2));
					});
			}
		);
	}
);
